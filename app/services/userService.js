const usersRepository = require("../repositories/usersRepository");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { EmailAlreadyRegisteredError, UnauthorizedError } = require("../errors");
const uploadImg = require("./utils/uploadImage");
function createToken(user, role) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      image: user.image,
      phone: user.phone,
      address: user.address,
      email: user.email,
      role: {
        id: role.id,
        name: role.name,
      },
    },
    process.env.JWT_SIGNATURE_KEY
  );
}

async function updateUser(id, updateParams, user) {
  /* updateParams = {name, image, phone, address, email, password,}*/

  if (id !== user.id.toString()) {
    const err = new UnauthorizedError("token doesn't match the user id!");
    return err;
  }

  const existingUser = await usersRepository.findUserByEmail(
    updateParams.email
  );

  if (existingUser !== null && updateParams.email !== user.email) {
    const err = new EmailAlreadyRegisteredError(updateParams.email);
    return err;
  }
  if (updateParams.password) {
    updateParams.encryptedPassword = bcryptjs.hashSync(updateParams.password);
  }

  if (updateParams.image) {
    updateParams.image = await uploadImg(updateParams.image);
  } else {
    updateParams.image = user.image;
  }

  const { encryptedPassword, verified, ...updatedUser } = (
    await usersRepository.updateUser(id, updateParams)
  ).dataValues;

  const accessToken = createToken(updatedUser, user.role);
  console.log(updatedUser);
  return { data: updatedUser, accessToken };
}

async function whoami(user) {
  const saldo = await usersRepository.getSaldo(user.id);
  user.saldo = saldo;
  return user;
}

module.exports = {
  updateUser,
  whoami,
};
