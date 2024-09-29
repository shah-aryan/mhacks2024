import pandas as pd
import eval7
from cv import infer_image
from itertools import combinations
import random

ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
suits = ["H", "D", "C", "S"]  # Hearts, Diamonds, Clubs, Spades
deck = [rank + suit for rank in ranks for suit in suits]

chip_denomination = [1,2,5,10]

df = pd.read_csv('preflop_ev.csv')

def load_ev_table(csv_file):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(csv_file, index_col='Cards')
    return df

def parse_cards_for_csv(card1, card2):
    # Get the rank of each card (the first character) and suit (the second character)
    rank1, suit1 = card1[0], card1[1]
    rank2, suit2 = card2[0], card2[1]

    sorted_ranks = '23456789TJQKA'
    if sorted_ranks.index(rank1) < sorted_ranks.index(rank2):
        rank1, rank2 = rank2, rank1
    
    # Determine if the cards are suited or unsuited
    if suit1 == suit2:
        # Suited hand
        cards = f"{rank1}{rank2} s" if rank1 != rank2 else f"{rank1}{rank2}"
    else:
        # Unsuited hand
        cards = f"{rank1}{rank2}" if rank1 != rank2 else f"{rank1}{rank2}"
    
    return cards

class PokerGame:
    def __init__(self):
        self.small_blind = 0
        self.big_blind = 0
        self.balance = 0
        self.player_hand = []
        self.board = []
        self.num_players = 8
        self.position = 0
        self.seen_cards = set()
        self.hand_type = ''
        self.pot_size = 0

    def get_blinds(self, small_blind, big_blind):
        self.small_blind = small_blind
        self.big_blind = big_blind

    def parse_bal(self, chip_list):
        sum = 0
        for i,e in enumerate(chip_list):
            sum += e * chip_denomination[i]
        return sum

    def get_state(self, img):
        res = infer_image(img)
        self.pot_size = self.parse_bal(res['pot'])
        self.balance = self.parse_bal(res['my_stack'])
        self.board = res['board']
        self.player_hand = res['hand']

    def preflop_ev(self, position):
        # Parse the card combination (formatted suited or unsuited)
        if len(self.player_hand) < 2:  
            self.player_hand = ['AS','KS']
        card1 = self.player_hand[0] 
        card2 = self.player_hand[1]
        self.seen_cards = set(self.player_hand)
        cards = parse_cards_for_csv(card1, card2)
        ev_table = load_ev_table(csv_file='preflop_ev.csv')

        # position to column index mapping
        position_map = {
            "SB": '0',
            "BB": '1',
            "3":  '2',
            "4": '3',
            "5": '4',
            "6": '5',
            "7": '6',
            "D": '7'
        }
        return ev_table.at[cards, position_map[position]]  
    
    def postflop_equity(self):
        toreturn = {}
        if len(self.board) < 3:
            self.board = ['AD','3D','QD']
        if len(self.player_hand) < 2:
            self.player_hand = ['AS','QS']
            self.seen_cards = set(self.player_hand)
        self.seen_cards.update(self.board)
        remaining_cards = [card for card in deck if card not in self.seen_cards]
        hand_card_obj = [eval7.Card(c[0] + c[1].lower()) for c in self.seen_cards]
        self.hand_type = eval7.handtype(eval7.evaluate(hand_card_obj))
        num_cards_needed = 5 - len(self.board)
        comb = list(combinations(remaining_cards, num_cards_needed))
        counter = 0
        for e in comb:
            #print(combined_cards)
            combined_cards = hand_card_obj + list(eval7.Card(c[0] + c[1].lower()) for c in e)
            next_hand = eval7.handtype(eval7.evaluate(combined_cards))
            if next_hand != self.hand_type:
                counter += 1
        equity = (1-(counter / len(comb)))/1.5
        return equity
    
    def gto_raise_amount(self):
    # Default raise size based on pot
        # if self.balance < self.pot_size*10:
        #     # Shove all-in if short-stacked (under 10 big blinds)
        #     return self.balance  # All-in strategy for short stacks

        return min(random.uniform(1, 1.5) * self.pot_size, self.balance)

    def calculate_thresholds(self, hand_equity):
        if self.pot_size == 0:
            self.pot_size = 1000
        fold_threshold = ((1 - hand_equity) / hand_equity * self.pot_size)/2
        raise_threshold = fold_threshold * 2 
        return fold_threshold, raise_threshold

    def gto_decision_insight(self, hand_equity):
        fold_threshold, raise_threshold = self.calculate_thresholds(hand_equity)
        # Provide insights to the user
        raise_amount = self.gto_raise_amount()
        print(f"raise_threshold: {raise_amount}")
        return (fold_threshold, raise_threshold, raise_amount)
    
    def get_hand_type(self):
        # get hand type from eval7
        seen = self.board + self.player_hand
        if len(seen) < 5:
            return "High Card"
        hand_card_obj = [eval7.Card(c[0] + c[1].lower()) for c in seen]
        self.hand_type = eval7.handtype(eval7.evaluate(hand_card_obj))
        return self.hand_type

    def get_balance(self):
        if self.balance <= 0:
            return 100
        return self.balance
    
    def get_pot_size(self):
        if self.pot_size <= 0:
            return 1000
        return self.pot_size

    def get_player_hand(self):
        if len(self.player_hand) < 2:
            self.player_hand = ['AS','KS']
        return self.player_hand

    def get_board(self):
        if len(self.board) < 3:
            self.board = ['AD','3D','QD']
        return self.board




#SB is 0
#BB is 1
#3 is 2
#4 is 3
#5 is 4
#6 is 5
#7 is 6
#D is 7

