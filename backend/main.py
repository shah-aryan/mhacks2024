from fastapi import FastAPI, HTTPException
from typing import Optional
from cv import infer_image
from poker import PokerGame

app = FastAPI()

game = None

@app.get("/")
def read_root():
    return {"message": "Welcome to my FastAPI backend!"}

@app.get("/init")
def init_endpoint(small_blind: int, big_blind: int):
    global game
    game = PokerGame()
    game.get_blinds(small_blind, big_blind)
    return {"status": "success"}

# game stage: preflop, flop, turn, river
# image: base64 encoded image
@app.get("/predict")
def predict_endpoint(game_stage: str, image: str, position: str, chip_denominations: Optional[list] = None):
    global game
    if game_stage not in ["preflop", "flop", "turn", "river"]:
        raise HTTPException(status_code=400, detail="Invalid game_stage. Must be 'preflop', 'flop', 'turn', or 'river'.")
    #game.get_state(image)
    if game_stage == "preflop":
        ev = game.preflop_ev(position)

        return {
            "user_value": game.get_balance(),
            "pot_value": game.get_pot_size(),
            "user_card_data": game.get_player_hand(),
            "table_card_data": game.get_board(),
            "expected_value": ev,
            "status": "success"
        }
    else:
        equity = game.postflop_equity()
        thresholds = game.calculate_thresholds(equity)
        insight = game.gto_decision_insight(equity)

        return {
            "user_value": game.get_balance(),
            "pot_value": game.get_pot_size(),
            "user_card_data": game.get_player_hand(),
            "table_card_data": game.get_board(),
            "bet_thresholds": thresholds,
            "equity": equity,
            "hand_type": game.get_hand_type(),
            "status": "success"
        }
 

@app.get("/test")
def test_endpoint():
    return {"message": "This is a test endpoint"}
