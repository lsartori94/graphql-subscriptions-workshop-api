const { prisma } = require("./generated/prisma-client");
const { GraphQLServer, PubSub } = require("graphql-yoga");

const DEVICES_CHANNEL = `devices-updates`;

const resolvers = {
  Query: {
    allDevices(root, args, context) {
      return context.prisma.devices({});
    },
    device(root, args, context) {
      return context.prisma.device({ id: args.deviceID });
    },
    devicesByUser(root, args, context) {
      return context.prisma
        .user({
          id: args.userID
        })
        .devices();
    },
    allUsers(root, args, context) {
      return context.prisma.users({});
    }
  },
  Mutation: {
    createDevice(root, args, context) {
      return context.prisma.createDevice({
        name: args.name,
        owner: {
          connect: { id: args.userID }
        }
      });
    },
    async updateDevice(root, args, context) {
      const update = await context.prisma.updateDevice({
        data: {
          ...args.data
        },
        where: { id: args.deviceID }
      });
      pubsub.publish(DEVICES_CHANNEL, {
        onDeviceUpdate: { id: update.id, status: update.status }
      });
      return update;
    },
    removeDevice(root, args, context) {
      return context.prisma.removeDevice({
        where: { id: args.deviceID }
      });
    },
    createUser(root, args, context) {
      return context.prisma.createUser({ name: args.name, email: args.email });
    },
    removeUser() {
      return context.prisma.removeUser({
        where: { id: args.userID }
      });
    },
    toggleDeviceStatus() {
      return context.prisma.updateDevice({
        data: args.status,
        where: args.deviceID
      });
    }
  },
  User: {
    devices(root, args, context) {
      return context.prisma
        .user({
          id: root.id
        })
        .devices();
    }
  },
  Device: {
    owner(root, args, context) {
      return context.prisma
        .devices({
          id: root.id
        })
        .owner();
    }
  },
  Subscription: {
    onDeviceUpdate: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(DEVICES_CHANNEL);
      }
    }
  }
};

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: {
    prisma,
    pubsub
  }
});
const options = {
  port: 4000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
    `Please go to http://localhost:${port}/playground to play with graphQL`
  )
);
