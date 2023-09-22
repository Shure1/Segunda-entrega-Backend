import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          /* es importante que sea de tipo objectId Y LA ref products para que sea posible aplicar populate */
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: function () {
      return [];
    },
  },
});

/* previo a lo que seria la generacion del modelo con findOne
traera la referencia del producto con el carrito*/
/* cartSchema.pre("findOne", function () {
  this.populate("products.id_prod");
});
 */
export const cartModel = model("carts", cartSchema);
