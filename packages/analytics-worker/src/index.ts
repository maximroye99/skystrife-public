import { Hono } from "hono";
import { Client } from "pg";

type Bindings = {
  DB_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/track-client-event/:chain_id/:world_address", async (c) => {
  const client = new Client(c.env.DB_URL);
  await client.connect();

  const { chain_id, world_address } = c.req.param();
  const { event_name, player_address, session_wallet_address, data } = await c.req.json();

  console.log(`Received event ${event_name} for ${world_address} on chain ${chain_id}`);
  console.log(`  player_address: ${player_address}`);
  console.log(`  session_wallet_address: ${session_wallet_address}`);
  console.log(`  data: ${data}`);

  try {
    await client.query(
      `
      INSERT INTO client_events_${chain_id} (
        event_name,
        world_address,
        player_address,
        session_wallet_address,
        data
      ) VALUES (
        '${event_name}',
        '${world_address}',
        '${player_address}',
        '${session_wallet_address}',
        '${data}'
      );
    `
    );

    return c.json({ ok: true, message: `Stored event ${event_name}` });
  } catch (e) {
    console.error(e);

    return c.json({ err: (e as Error).toString() }, 500);
  }
});

app.post("/track/:chain_id/:world_address", async (c) => {
  const client = new Client(c.env.DB_URL);
  await client.connect();

  const { chain_id, world_address } = c.req.param();
  const {
    entity,
    system_call,
    system_id,
    gas_estimate,
    manual_gas_estimate,
    gas_price_gwei,
    status,
    hash,
    error,
    submitted_block,
    completed_block,
    submitted_timestamp,
    completed_timestamp,
    player_address,
    match_entity,
    session_wallet_address,
  } = await c.req.json();

  console.log(`Received tx ${hash} for ${world_address} on chain ${chain_id}`);
  console.log(`  entity: ${entity}`);
  console.log(`  system_call: ${system_call}`);
  console.log(`  gas_estimate: ${gas_estimate}`);
  console.log(`  manual_gas_estimate: ${manual_gas_estimate}`);
  console.log(`  gas_price_gwei: ${gas_price_gwei}`);
  console.log(`  status: ${status}`);
  console.log(`  hash: ${hash}`);
  console.log(`  error: ${error}`);
  console.log(`  submitted_block: ${submitted_block}`);
  console.log(`  completed_block: ${completed_block}`);
  console.log(`  submitted_timestamp: ${submitted_timestamp}`);
  console.log(`  completed_timestamp: ${completed_timestamp}`);
  console.log(`  player_address: ${player_address}`);
  console.log(`  match_entity: ${match_entity}`);
  console.log(`  session_wallet_address: ${session_wallet_address}`);

  try {
    await client.query(
      `INSERT INTO player_transactions_${chain_id} (
        world_address,
        entity,
        system_call,
        system_id,
        gas_estimate,
        manual_gas_estimate,
        gas_price_gwei,
        status,
        hash,
        error,
        submitted_block,
        completed_block,
        submitted_timestamp,
        completed_timestamp,
        player_address,
        match_entity,
        session_wallet_address
      ) VALUES (
        '${world_address}',
        '${entity}',
        '${system_call}',
        '${system_id}',
        ${gas_estimate},
        ${manual_gas_estimate === "true" ? "TRUE" : "FALSE"},
        ${gas_price_gwei},
        '${status}',
        '${hash}',
        '${error}',
        ${submitted_block},
        ${completed_block},
        ${submitted_timestamp},
        ${completed_timestamp},
        '${player_address}',
        '${match_entity}',
        '${session_wallet_address}'
      );`
    );

    return c.json({ ok: true, message: `Stored tx ${hash}` });
  } catch (e) {
    console.log(e);

    return c.json({ err: (e as Error).toString() }, 500);
  }
});

export default app;
