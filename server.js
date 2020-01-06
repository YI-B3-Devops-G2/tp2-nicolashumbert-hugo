const express = require('express')
const app = express();
const { Client } = require('pg')
const redis = require('redis')

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
});

client.connect().catch(e=>console.log(e));
const redisClient = redis.createClient({ host: 'devops_redis' });

app.use(express.json());


app.get('/api', function(req, res) {
    res.json({ message: 'Hello World'});
});

app.get('/api/status', async function(req, res) {
    const uptimePG = await client.query("SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time()) as uptime;");
    
    const uptime = uptimePG.rows[0].uptime

    const uptimeString = () => {
        let time = ""
    
        time += uptime.hours ? `${uptime.hours}h ` : ""
        time += uptime.minutes ? `${uptime.minutes}m ` : ""
        time += uptime.seconds ? `${uptime.seconds}s` : ""
    
        return time
      }


    res.json({ 
        status: 'OK',
        postgresUptime: uptimeString(),
        redisConnectedClients:Number(redisClient.server_info.connected_clients)
    });
});

// start the app
app.listen(3000, function() {
    console.log("Express is running on port 3000");
});