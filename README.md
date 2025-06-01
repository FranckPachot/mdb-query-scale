# MongoDB Query Scalability Test

The primary objective of this test is to assess how effectively MongoDB handles query performance as the collection size increases, simulating an Online Transaction Processing (OLTP) workload. In OLTP scenarios, response times should be proportional to the size of the query result, not the entire collection. This benchmark showcases MongoDB's capability to utilize indexes efficiently, ensuring fast queries even with large datasets. You are encouraged to run it on other MongoDB "compatible" databases, because they may not have the same indexing capabilities as MongoDB.

The test uses a document model inspired by Josh Smith's [RDBMS Comparator](https://github.com/jesmith17/rdbms_comparator), a Spring-Boot app running on MongoDB and PostgreSQL databases to compare the queries generated. It is an order-entry application (schema [here](https://jesmith17.github.io/rdbms_comparator/assets/images/mongo_schema-c22d8663e195075707c9b5d79ed1f0ac.png)).

The `runme.js` initializes the collections and indexes and runs several times the following:
- insert new orders
- run a few queries
it displays the elapsed time.

The queries are:
- Query 1: Find the last order by a unique customer email.
```
db.orders.find({
    "customer.emails.email": "Russ51@hotmail.com",
  })
    .sort({
      "orderDate": -1
    })
    .limit(10)
```
It uses the following index: `{ "orderStatus": 1, "shippingStatus": 1, "details.product.name": 1,  "deliveryDate": -1 }`

- Query 2: Find the last delivered orders for specified products.
```
db.orders.find({
    "orderStatus": "Shipped",
    "shippingStatus": "Delivered",
    "details.product.name": { $in: [ "Mango Pie", "Lemon Pie", "Orange Pie", "Apple Pie" ] },
  })
    .sort({
      "deliveryDate": -1
    })
    .limit(10)
```
It uses the following index: `{ "customer.emails.email": 1, "orderDate": -1 }`

- Query 3: Estimated count of orders.
```
db.orders.estimatedDocumentCount();
```

## Example of output:
```

[mlab data]# npm install @faker-js/faker

[mlab data]# mongosh -f runme.js

Creating customers...
Inserted 10000 customers.
Creating products...
Inserted 10000 products.
Creating stores...
Inserted 10000 stores.
Creating indexes...
Indexes created.
Inserting batch 1 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 1. Elapsed time: 18804 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:        50000, Query 1:      3 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 2 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 2. Elapsed time: 25883 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       100000, Query 1:      3 ms, Query 2:      3 ms, Query 3:      1 ms
Inserting batch 3 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 3. Elapsed time: 19608 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       150000, Query 1:     14 ms, Query 2:      8 ms, Query 3:      5 ms
Inserting batch 4 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 4. Elapsed time: 23202 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       200000, Query 1:     12 ms, Query 2:      7 ms, Query 3:      3 ms
Inserting batch 5 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 5. Elapsed time: 26995 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       250000, Query 1:      4 ms, Query 2:      7 ms, Query 3:      5 ms
Inserting batch 6 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 6. Elapsed time: 20630 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       300000, Query 1:      4 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 7 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 7. Elapsed time: 22000 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       350000, Query 1:      8 ms, Query 2:      6 ms, Query 3:      3 ms
Inserting batch 8 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 8. Elapsed time: 31208 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       400000, Query 1:      4 ms, Query 2:      3 ms, Query 3:      1 ms
Inserting batch 9 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 9. Elapsed time: 21480 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       450000, Query 1:     12 ms, Query 2:      7 ms, Query 3:      3 ms
Inserting batch 10 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 10. Elapsed time: 20617 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       500000, Query 1:      3 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 11 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 11. Elapsed time: 31437 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       550000, Query 1:      5 ms, Query 2:      7 ms, Query 3:      3 ms
Inserting batch 12 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 12. Elapsed time: 23261 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       600000, Query 1:      4 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 13 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 13. Elapsed time: 33647 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       650000, Query 1:      4 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 14 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 14. Elapsed time: 21941 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       700000, Query 1:      4 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 15 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 15. Elapsed time: 24361 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       750000, Query 1:      3 ms, Query 2:      5 ms, Query 3:      2 ms
Inserting batch 16 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 16. Elapsed time: 21567 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       800000, Query 1:     17 ms, Query 2:      6 ms, Query 3:      3 ms
Inserting batch 17 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 17. Elapsed time: 29607 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       850000, Query 1:      4 ms, Query 2:      4 ms, Query 3:      2 ms
Inserting batch 18 of orders...
Creating orders...
Inserted 50000 orders.
Finished batch 18. Elapsed time: 23377 ms
Running some queries...
Running Query 1: Find last order by customer email
Running Query 2: Find last delivered orders for some products
Running Query 3: Estimated count of orders
=== Queries response time  === Total documents:       900000, Query 1:      3 ms, Query 2:      3 ms, Query 3:      2 ms
```

As the collection size increases, the response time of the queries remains consistent. This validates that the indexes are correctly addressing the query access patterns.

If you run it on other databases that claim MongoDB compatibility, please share the result (create an issue). Examples: Amazon DocumentDB, Azure CosmosDB, Oracle ORDS, FerretDB, Percona, Google Firestore. As they are an emulation of the MongoDB API on top of a non-document database, they don't have the same indexing capabilities.
