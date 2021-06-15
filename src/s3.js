require('dotenv').config()

const S3=require('aws-sdk/client/s3');


const bucketname =process.env.AWS_BUCKET_NAME
const region=process.env.AWS_BUCKET_REGION
const accessKeyId=process.env.AWS_ACCESS_KEY
const secretAccessKey=process.env.AWS_SECRET_KEY

const s3=new S3({
      region,
      accessKeyId,
      secretAccessKey

})

//upload a file



//download a file