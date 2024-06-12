const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data : [
                {name : "Computer Science"},
                {name : "Fitness"},
                {name : "Photography"},
                {name : "Music"},
                {name : "Arts"},
            ]
        });

        console.log("success");
    } catch (error) {
        console.log(`Error seeding the categories in the database : `, error);
    } finally{
        await database.$disconnect();
    }
}

main();