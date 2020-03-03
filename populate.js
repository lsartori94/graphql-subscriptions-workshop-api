const { prisma } = require("./generated/prisma-client");

// A `main` function so that we can use async/await
async function main() {
  // Create User
  const newUser = await prisma.createUser({
    name: "John Doe",
    email: "john@doe.com"
  });
  console.log(`Created new User: ${newUser.name} (Email: ${newUser.email})`);
  // Create some devices
  var newDevice;
  newDevice = await prisma.createDevice({
    name: "Burger King",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);
  newDevice = await prisma.createDevice({
    name: "McDonalds",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);
  newDevice = await prisma.createDevice({
    name: "Wendy's",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);
  newDevice = await prisma.createDevice({
    name: "White Castle",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);
  newDevice = await prisma.createDevice({
    name: "Subway",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);
  newDevice = await prisma.createDevice({
    name: "Mostaza",
    status: "OFFLINE",
    owner: { connect: { id: newUser.id } }
  });
  console.log(`Created new Device: ${newDevice.name} (ID: ${newDevice.id})`);

  // Read all users from the database and print them to the console
  const allDevices = await prisma.devices();
  console.log(allDevices);
}

main().catch(e => console.error(e));
