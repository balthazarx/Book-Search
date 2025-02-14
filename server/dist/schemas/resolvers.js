//import { AuthenticationError } from '@apollo/server';
import { signToken } from '../services/auth.js';
import User from '../models/User.js';
import { GraphQLError } from 'graphql';
const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return User.findOne({ _id: context.user._id });
        }
    },
    Mutation: {
        addUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_, { email, password }) => {
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
        saveBook: async (_, { bookData }, context) => {
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: bookData } }, { new: true, runValidators: true });
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
        }
    }
};
export default resolvers;
