from fastapi import FastAPI, HTTPException, Body
from typing import Optional
from cv import infer_image  # Assuming this is a custom module
from poker import PokerGame  # Assuming this is a custom module
from pydantic import BaseModel
from contextlib import asynccontextmanager

app = FastAPI()
game = None

# Define lifespan context to handle startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    global game
    # Startup logic: initialize the PokerGame when the app starts
    game = PokerGame()
    small_blind = 1
    big_blind = 2
    game.get_blinds(small_blind, big_blind)
    print("Poker game initialized on startup.")
    
    # Hand over control to the application
    yield
    
    # Shutdown logic (optional): Add cleanup code here if necessary
    print("Shutdown event triggered. Cleaning up resources.")

# Pass the lifespan context to the FastAPI app
app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    print("Welcome to my FastAPI backend!")
    return {"message": "Welcome to my FastAPI backend! hi sanjit"}

# Define the model for the request body
class PredictRequest(BaseModel):
    image: str
    game_stage: str


@app.post("/echo")
def echo_endpoint(message: str):
    print(f"Received message: {message}")


@app.post("/predict")
def predict_endpoint(
    image: str = Body(..., embed=True),
    game_stage: str = Body(..., embed=True)
):
    print("Predicting...")
    position = 'BB'
    global game

    if game_stage not in ["preflop", "flop", "turn", "river"]:
        raise HTTPException(status_code=400, detail="Invalid game_stage. Must be 'preflop', 'flop', 'turn', or 'river'.")

    game.get_state(image)  # Uncomment if needed
    
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
