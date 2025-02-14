import { type UserDocument } from '../models/User.js';
//import { AuthenticationError } from '@apollo/server';
import { signToken } from '../services/auth.js';
import User from '../models/User.js';
import { GraphQLError } from 'graphql';

const resolvers = {
    Query: {
      me: async (_: any, __: any, context: { user?: UserDocument }) => {
        if (!context.user) {
          throw new GraphQLError('You need to be logged in!', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }
        return User.findOne({ _id: context.user._id });
      }
    },

  Mutation: {
    addUser: async (_: any, args: { username: string; email: string; password: string }) => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new GraphQLError('No user found with this email address', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new GraphQLError('Incorrect credentials', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }
  
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },

    saveBook: async (_: any, { bookData }: any, context: { user?: UserDocument }) => {
        if (!context.user) {
          throw new GraphQLError('You need to be logged in!', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (_: any, { bookId }: { bookId: string }, context: { user?: UserDocument }) => {
        if (!context.user) {
          throw new GraphQLError('You need to be logged in!', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    }
  }
};

export default resolvers;