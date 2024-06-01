import {mongoose} from '@typegoose/typegoose'

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            maxPoolSize:10
        })
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}