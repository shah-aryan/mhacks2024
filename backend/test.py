from poker import *
from main import *
from cv import *

#initialize game
init_endpoint(5, 10)
# game.get_state('test-images/chips-test.jpg')
#turn image file into base64
encoded_image = encode_image_to_base64('test-images/chips-test.jpg')
# predict_endpoint('preflop', encoded_image, 'BB', [1,2,5,10])
predict_endpoint('flop', encoded_image, 'BB', [1,2,5,10])
# predict_endpoint('turn', encoded_image, 'BB', [1,2,5,10])
# predict_endpoint('river', encoded_image, 'BB', [1,2,5,10])

