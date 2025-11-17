import {PrismaClient, Prisma, OrderStatus, UserType, PaymentMethod, Category, Item, User} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
            name: 'Admin User',
            email: 'rnathanmoreira@gmail.com',
            password: '$2a$12$nFxZ7y6hWAsXiE.bStThG.82hWkBarl7m5fLqzur72GFBuZ/XmEoq', // hashed password for '123456'
            phone: '1234567890',
            type: UserType.ADMIN,
        },
        {
            name: 'Customer User',
            email: 'teste@gmail.com',
            password: '$2a$12$nFxZ7y6hWAsXiE.bStThG.82hWkBarl7m5fLqzur72GFBuZ/XmEoq', // hashed password for '123456'
            phone: '0987654321',
            type: UserType.CLIENT,
        },
    ]

    for (const userData of users) {
        await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData,
        });
    }

    const categories: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
            name: 'Lanches',
            description: 'Deliciosos pratos principais para sua refeição',
        },
        {
            name: 'Bebidas',
            description: 'Bebidas alcoólicas e não alcoólicas',
        },
        {
            name: 'Acompanhamentos',
            description: 'Acompanhamentos diversos para suas refeições',
        },
        {
            name: 'Sobremesas',
            description: 'Deliciosas sobremesas para finalizar sua refeição',
        },
    ];

    for (const categoryData of categories) {
        await prisma.category.upsert({
            where: { name: categoryData.name },
            update: {},
            create: categoryData,
        });
    }

    const items: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
            name: 'Hambúrguer',
            description: 'Delicioso hambúrguer artesanal com queijo, alface e tomate.',
            unitPrice: new Prisma.Decimal('15.99'),
            categoryId: BigInt(1),
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            available: true
        },
        {
            name: 'Refrigerante',
            description: 'Bebida gaseificada gelada para acompanhar sua refeição.',
            unitPrice: new Prisma.Decimal('4.99'),
            categoryId: BigInt(2),
            imageUrl: 'https://images.unsplash.com/photo-1735643434124-f51889fa1f8c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            available: true
        },
        {
            name: 'Batata Frita',
            description: 'Porção de batatas fritas crocantes e saborosas.',
            unitPrice: new Prisma.Decimal('8.99'),
            categoryId: BigInt(3),
            imageUrl: 'https://images.unsplash.com/photo-1676566399758-51b0d3927d48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            available: true
        },
        {
            name: 'Sorvete',
            description: 'Sorvete cremoso em diversos sabores para refrescar seu dia.',
            unitPrice: new Prisma.Decimal('6.50'),
            categoryId: BigInt(4),
            imageUrl: 'https://images.unsplash.com/photo-1594488506255-a8bbfdeedbaf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            available: true
        },
    ];

    for (const itemData of items) {
        await prisma.item.upsert({
            where: { name: itemData.name },
            update: {},
            create: itemData,
        });
    }

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })