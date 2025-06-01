

/*
npm install @faker-js/faker
*/


const { faker } = require('@faker-js/faker');

// Helper function for random selection
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Types for phones and emails
const types = ['work', 'home', 'mobile'];

async function createCustomers(db) {
  console.log('Creating customers...');

  let customers = [];
  for (let i = 0; i < 10000; i++) {
    const address = {
      city: faker.location.city(),
      country: faker.location.countryCode(),
      state: faker.location.state({ abbreviated: true }),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode()
    };

    const phones = Array.from({ length: 2 }, () => ({
      type: randomChoice(types),
      number: faker.phone.number()
    }));

    const emails = Array.from({ length: 3 }, () => ({
      type: randomChoice(types),
      email: faker.internet.email()
    }));

    customers.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      title: faker.person.jobTitle(),
      address,
      phones,
      emails
    });
  }

  await db.customers.insertMany(customers);
  console.log(`Inserted ${customers.length} customers.`);
}

async function createProducts(db) {
  console.log('Creating products...');

  let products = [];
  for (let i = 0; i < 10000; i++) {
    products.push({
      name: randomChoice([
        faker.commerce.productName(),
        faker.food.dish(),
        faker.commerce.department()
      ]),
      dept: faker.number.int({ min: 1, max: 100 }),
      price: faker.commerce.price({ min: 0.01, max: 10000, dec: 2 }),
      description: faker.lorem.text()
    });
  }

  await db.products.insertMany(products);
  console.log(`Inserted ${products.length} products.`);
}

async function createStores(db) {
  console.log('Creating stores...');

  let stores = [];
  for (let i = 0; i < 10000; i++) {
    const address = {
      city: faker.location.city(),
      country: faker.location.countryCode(),
      state: faker.location.state({ abbreviated: true }),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode()
    };

    stores.push({
      name: faker.company.name(),
      address,
      managerName: faker.person.fullName(),
      region: randomChoice([
        'Midwest', 'South', 'West', 'North', 'Great Lakes', 'Sun Belt',
        'SoCal', 'NorCal', 'New England'
      ]),
      storeType: randomChoice([
        'Super Store', 'Standard', 'Small', 'Urban', 'Custom', 'Embedded'
      ]),
      sqFt: faker.number.int({ min: 1000, max: 10000 })
    });
  }

  await db.stores.insertMany(stores);
  console.log(`Inserted ${stores.length} stores.`);
}

async function createOrders(db) {
  console.log('Creating orders...');
  const customers = await db.customers.find({}, { projection: { phones: 0, emails: 0 } }).toArray();
  const products = await db.products.find({}).toArray();
  const stores = await db.stores.find({}, { projection: { address: 0 } }).toArray();

  let orders = [];
  for (let i = 0; i < 50000; i++) {
    const customer = randomChoice(customers);
    const store = randomChoice(stores);

    const details = Array.from({ length: faker.number.int({ min: 1, max: 30 }) }, () => ({
      quantity: faker.number.int({ min: 1, max: 10 }),
      product: randomChoice(products),
    }));

    const currentTime = new Date(); // Use the current time for all date fields

    orders.push({
      orderDate: currentTime,
      warehouseId: faker.number.int({ min: 1, max: 9999 }),
      fillDate: currentTime,
      purchaseOrder: faker.string.alphanumeric(15),
      invoiceId: faker.number.int({ min: 1, max: 9999 }),
      invoiceDate: currentTime,
      deliveryMethod: randomChoice(['Door Dash', 'Uber', 'Local', 'Truck', 'Cargo Ship', 'Plane', 'Rail']),
      weight: faker.number.int({ min: 1, max: 9999 }),
      totalPieces: faker.number.int({ min: 1, max: 9999 }),
      pickDate: currentTime,
      shippingMethod: randomChoice(['Drop', 'Freight', 'Carrier', 'USPS']),
      billingDept: faker.number.int({ min: 1, max: 9999 }),
      orderStatus: randomChoice(['Received', 'Accepted', 'Processed', 'Filling', 'Filled', 'Packed', 'Shipped', 'Cancelled']),
      shippingStatus: randomChoice(['Ticketed', 'In Transit', 'At Warehouse', 'Out for Delivery', 'Delivered', 'Delayed', 'Cancelled']),
      deliveryDate: currentTime,
      orderType: faker.number.int({ min: 1, max: 10 }),
      employeeId: faker.number.int({ min: 1, max: 234 }),
      total: faker.commerce.price({ min: 0.01, max: 10000, dec: 2 }),
      details,
      customer,
      shippingAddress: customer.address,
      store
    });
  }

  await db.orders.insertMany(orders);
  console.log(`Inserted ${orders.length} orders.`);
}

async function createIndexes(db) {
  console.log("Creating indexes...");

  await db.orders.createIndex({
    "orderStatus": 1,
    "shippingStatus": 1,
    "details.product.name": 1,
    "deliveryDate": -1,
  });

  await db.orders.createIndex({
    "customer.emails.email": 1           ,
    "orderDate": -1           ,
  });

  console.log(`Indexes created.`);
}

async function runSomeQueries(db) {
  console.log("Running queries...");

  console.log(`Running Query 1: Find last order by customer email`);
  const startQuery1 = Date.now(); // Start timer for query 2
  const result1 = await db.orders.find({
    "customer.emails.email": "Russ51@hotmail.com",
  })
    .sort({
      "orderDate": -1
    })
    .limit(10)
    .toArray(); // Fetch result and ensure promise is awaited
  const endQuery1 = Date.now(); // End timer for query 1

  console.log(`Running Query 2: Find last delivered orders for some products`);
  const startQuery2 = Date.now();
  const result2 = await db.orders.find({
    "orderStatus": "Shipped",
    "shippingStatus": "Delivered",
    "details.product.name": { $in: [ "Mango Pie", "Lemon Pie", "Orange Pie", "Apple Pie" ] },
  })
    .sort({
      "deliveryDate": -1
    })
    .limit(10)
    .toArray(); // Fetch result and ensure promise is awaited
  const endQuery2 = Date.now();

  console.log(`Running Query 3: Estimated count of orders`);
  const startQuery3 = Date.now();
  const totalCount = await db.orders.estimatedDocumentCount();
  const endQuery3 = Date.now();

  // Log results in one line
  console.log(
   `=== Queries response time  === Total documents: ${String(totalCount).padStart(12, ' ')}`
   + `, Query 1: ${String((endQuery1 - startQuery1)).padStart(6, ' ')} ms`
   + `, Query 2: ${String((endQuery2 - startQuery2)).padStart(6, ' ')} ms`
   + `, Query 3: ${String((endQuery3 - startQuery3)).padStart(6, ' ')} ms`
  );
}


async function main() {
  try {
    await createCustomers(db);
    await createProducts(db);
    await createStores(db);
    await createIndexes(db);
    for (let i = 0; i < 10; i++) {
      console.log(`Inserting batch ${i + 1} of orders...`);
      await createOrders(db); // Wait for orders creation to finish in each iteration
      console.log(`Finished batch ${i + 1}. Running some queries...`);
      await runSomeQueries(db);
    }
    console.log('All tasks completed successfully!');
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
}


db.customers.drop();
db.products.drop();
db.stores.drop();
db.orders.drop();

main()
