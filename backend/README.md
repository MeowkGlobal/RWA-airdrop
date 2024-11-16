# Equity Airdrop ZK Proof Backend

A NestJS-based backend service for generating Zero Knowledge proofs for equity airdrops.

## Description

This backend service provides an API endpoint for generating ZK proofs that verify equity ownership while maintaining privacy. The service uses Circom for ZK proof generation and includes threshold validation for stock quantity and holding periods.

## Installation

```bash
$ npm install
```

## Environment Variables

The following environment variables need to be set:

```bash
STOCK_QUANTITY_THRESHOLD=<minimum_stock_quantity>
HOLDING_PERIOD_THRESHOLD_DAYS=<minimum_holding_period_in_days>
```

## API Endpoints

### Generate ZK Proof

```
POST /api/v1/generateZkProof
```

#### Request Body
```json
{
  "address": "string",       // Wallet address
  "stockQuantity": "number", // Amount of stock owned
  "stockBuyTimestamp": "string" // ISO date of stock purchase
}
```

#### Response
```json
{
  "statusCode": 201,
  "data": {
    "proof": "string",    // ZK proof calldata
    "publicInputs": "string[]" // Public inputs for verification
  },
  "message": "ZK proof generated successfully"
}
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

[MIT licensed](LICENSE)