from keras.layers import Layer


class ForwardLayer(Layer):

  def __init__(self, name: str):
      super(ForwardLayer, self).__init__(name=name)

  def build(self):
      pass

  def call(self, inputs):
      return inputs
