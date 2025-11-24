import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@learnai.cards" },
    update: {},
    create: {
      email: "demo@learnai.cards",
      name: "Demo Learner",
      passwordHash,
    },
  });

  const deck = await prisma.deck.upsert({
    where: { id: "demo-deck" },
    update: {},
    create: {
      id: "demo-deck",
      title: "JS Core Basics",
      description: "Sample cards to explore LearnAI Cards",
      userId: user.id,
    },
  });

  const existingCards = await prisma.card.count({ where: { deckId: deck.id } });
  if (existingCards === 0) {
    await prisma.card.createMany({
      data: [
        {
          deckId: deck.id,
          userId: user.id,
          question: "What does `const` mean in JavaScript?",
          answer: "Creates a block-scoped binding that cannot be reassigned.",
          dueAt: new Date(),
        },
        {
          deckId: deck.id,
          userId: user.id,
          question: "Explain event loop briefly.",
          answer:
            "It processes call stack tasks and handles async callbacks via the queue.",
          dueAt: new Date(),
        },
        {
          deckId: deck.id,
          userId: user.id,
          question: "What is closure?",
          answer:
            "Function remembering variables from its lexical scope even when executed later.",
          dueAt: new Date(),
        },
      ],
    });
  }

  console.log("Seed data created.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
