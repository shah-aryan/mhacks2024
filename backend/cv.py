
import base64
from PIL import Image
import io  # Used for in-memory binary streams
from inference_sdk import InferenceHTTPClient
from dotenv import load_dotenv
import os

def encode_image_to_base64(image_path):
    try:
        with open(image_path, 'rb') as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        # print(f"Error: The file at {image_path} was not found.")
        return None

def split_image(image):
    width, height = image.size
    top_half = image.crop((0, 0, width, height // 2))
    bottom_half = image.crop((0, height // 2, width, height))
    return top_half, bottom_half

def encode_pil_image_to_base64(image):
    # Encode a PIL Image to base64
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return encoded_image

def infer_card(encoded_image):
    # Initialize the clients for both endpoints
    load_dotenv()
    api_key = os.getenv("API_KEY")

    CARD_CLIENT = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key=api_key
    )

    if encoded_image:
        result = CARD_CLIENT.infer(f"data:image/png;base64,{encoded_image}", model_id="playing-cards-ow27d/4")
        predictions = result.get("predictions", [])
        
        # Extract the 'class' field from each prediction
        classes = [pred["class"] for pred in predictions]
        
        classes = set(classes)
        classes = list(classes)
        return classes
    
    else:
        return {"error": "Failed to load and encode the card image."}

def infer_stack(encoded_image):
    load_dotenv()
    api_key = os.getenv("API_KEY")

    STACK_CLIENT = InferenceHTTPClient(
        api_url="https://outline.roboflow.com",
        api_key=api_key
    )

    if encoded_image:
        result = STACK_CLIENT.infer(f"data:image/png;base64,{encoded_image}", model_id="dgen-alex-3.0/2")
        predictions = result.get("predictions", [])
        
        # Sort the predictions by the average x-coordinate
        sorted_predictions = sorted(predictions, key=lambda pred: sum(point['x'] for point in pred['points']) / len(pred['points']))
        
        # Extract the integer part of the class_id, removing "class_" prefix if present
        sorted_class_ids = [int(pred['class'].replace("chip_", "")) for pred in sorted_predictions]
        
        return sorted_class_ids
    else:
        return {"error": "Failed to load and encode the stack image."}

def is_valid_file_path(file_path):
    # Check if the given string is a valid file path
    return os.path.isfile(file_path)

def infer_image(image_input):
    # Check if the input is a valid file path

    #write image input to a file, it is a string
    with open('image_input.txt', 'w') as f:
        f.write(image_input)

    try:
        # Check if it's a base64 image string by splitting at comma
        if "," in image_input:
            base64_content = image_input.split(",")[1]
        base64_content = image_input
        decoded_data = base64.b64decode(base64_content, validate=True)
        image = Image.open(io.BytesIO(decoded_data))
    except (IndexError, base64.binascii.Error) as e:
        print(f"error: Failed to decode the base64 image string.")

    # Continue processing the 
    top_half, bottom_half = split_image(image)

    encoded_top_half = encode_pil_image_to_base64(top_half)
    saved_top_half = Image.open(io.BytesIO(base64.b64decode(encoded_top_half)))
    saved_top_half.save('test-images/top_half.jpg')
    encoded_bottom_half = encode_pil_image_to_base64(bottom_half)
    saved_bottom_half = Image.open(io.BytesIO(base64.b64decode(encoded_bottom_half)))
    saved_bottom_half.save('test-images/bottom_half.jpg')
    
    pot = infer_stack(encoded_top_half)
    my_stack = infer_stack(encoded_bottom_half)
    board = infer_card(encoded_top_half)
    hand = infer_card(encoded_bottom_half)

    print(f"Pot: {pot}")
    print(f"My Stack: {my_stack}")
    print(f"Board: {board}")
    print(f"Hand: {hand}")

    res = {
        "pot": pot,
        "my_stack": my_stack,
        "board": board,
        "hand": hand
    }

    return res



#test infer_card and infer_stack
# infer_card_test = infer_card(encode_image_to_base64('test-images/playingcard.jpg'))
# infer_stack_test = infer_stack(encode_image_to_base64('test-images/chips-test.jpg'))
# print(infer_card_test)
# print(infer_stack_test)
