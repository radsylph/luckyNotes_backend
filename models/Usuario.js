import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9.!#$   %&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(
            value
          ); // Validar que sea un correo electrónico
        },
        message: "Agrega un correo válido",
      },
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
    confirmado: Boolean,
  },
  {
    timestamps: true, // Habilitar timestamps (createdAt y updatedAt)
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar la contraseña
usuarioSchema.methods.verificarPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  console.log(result); // log the result of the bcrypt.compare method to check if it is true or false
  return result;
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
