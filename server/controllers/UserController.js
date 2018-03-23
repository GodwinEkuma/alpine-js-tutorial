import bcrypt from 'bcrypt';
import models from '../models';
import signToken from '../helpers/signToken';

const { User } = models;
/**
 * A class that mannipulates sign in and  sign up
 */
export default class UserController {
  /**
   * Signs up a user
   * @param {*} req
   * @param {*} res
   * @returns {json} response
   */
  static signUp(req, res) {
    const {
      email, password, firstName, lastName
    } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    User.findOne({ where: { email } })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(403).json({
            error: true,
            message: 'A user with email already exist try a new email'
          });
        } else if (!foundUser) {
          User.create({
            email,
            password: hashPassword,
            firstName,
            lastName
          })
            .then((newUser) => {
              if (newUser) {
                const token = signToken(newUser);
                return res.status(201).json({
                  error: false,
                  message: 'sign up succesful',
                  token,
                  user: {
                    id: newUser.id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName
                  }
                });
              }
            })
            .catch((error) => {
              if (error) {
                return res.status(500).json({
                  error: true,
                  message: 'Internal server error'
                });
              }
            });
        }
      });
  }
  /**
   * Signs in a user
   * @param {*} req
   * @param {*} res
   * @returns {json} response
   */
  static signIn(req, res) {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(401).json({
            error: true,
            message: 'Email does not exist'
          });
        } else if (!bcrypt.compareSync(password, foundUser.password)) {
          return res.status(401).json({
            error: true,
            message: 'the password does not match the user'
          });
        }
        const token = signToken(foundUser);
        return res.status(200).json({
          error: false,
          message: 'Login was succesful',
          token,
          user: {
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName
          }
        });
      })
      .catch((error) => {
        if (error) {
          return res.status(500).json({
            error: true,
            message: 'Internal server error'
          });
        }
      });
  }
}
