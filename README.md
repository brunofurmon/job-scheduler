# job-scheduler

An asynchronous HTTP job scheduler boilerplate

## Dependencies

-   [Docker](https://www.docker.com/docker-community)

## Running

Through docker-compose:
`docker-compose up --build`

### Local

`make start` - Starts both worker and server on a docker instance
`make start-server` - Starts only server on a docker instance
`make start-worker` - Starts only worker on a docker instance

All of the above commands assume you have configured your environment variables accordingly

## Environment variables:

| Name            | Description                                                     | Default Value        |
| --------------- | --------------------------------------------------------------- | -------------------- |
| APP_PREFIX      | Application prefix, on logger entries                           | job-scheduler        |
| NODE_ENV        | NodeJs environment, which can be 'development' and 'production' | development          |
| DEBUG           | The debug filter expression. `*` means every log entry          | job-scheduler\*      |
| SERVER_PORT     | Local server port where the web server runs                     | 3000                 |
| JOB_TOPIC       | Name of the job topic to be created/read                        | jobs                 |
| MONGO_URI       | Mongo connection string to where read/write job states          | mongodb://mongo/jobs |
| NSQ_WRITER_ADDR | NSQ message bus where to publish job requests                   | nsqd:4150            |
| NSQ_READER_ADDR | NSQ lookupd address where to listen for job requests            | nsqlookupd:4161      |

## Healthcheck:

-   Live:
    `/healthcheck`
-   Ready (check dependencies):
    `/readiness`

## Postman endpoints:

Please check `job-scheduler.postman_collection.json`.
