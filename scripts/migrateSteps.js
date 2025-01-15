// Import the Prisma Client
// To run: node scripts/migrateSteps.js

import { prisma } from '/Kim/React-Projects/recipes/src/lib/prisma.js';

async function migrateStepsToNewStructure() {
  try {
    console.log('Starting migration...');

    // Fetch all recipes with their steps
    const recipesWithSteps = await prisma.recipes.findMany({
      include: {
        steps: true, // Include all steps for each recipe
      },
    });

    // Loop through recipes and create instructions and stepsNew
    for (const recipe of recipesWithSteps) {
      if (recipe.steps.length > 0) {
        // Check if an instruction already exists for this recipe
        let instruction = await prisma.instructions.findFirst({
          where: {
            recipe_id: recipe.recipe_id,
          },
        });

        // If no instruction exists, create one
        if (!instruction) {
          instruction = await prisma.instructions.create({
            data: {
              topic: `Instructions for Recipe ${recipe.recipe_id}`, // Adjust topic as needed
              recipe_id: recipe.recipe_id,
            },
          });
        }

        // Create the StepsNew records for each step
        for (const step of recipe.steps) {
          await prisma.stepsNew.create({
            data: {
              step_number: step.step_number,
              instruction: step.instruction,
              instruction_id: instruction.instruction_id, // Link to the existing or new Instructions record
            },
          });
        }
      }
    }

    console.log('Migration completed successfully!');

    // Rename tables after migration
    console.log('Renaming tables...');
    await prisma.$executeRaw`ALTER TABLE Steps RENAME TO oldSteps;`;
    await prisma.$executeRaw`ALTER TABLE StepsNew RENAME TO Steps;`;
    console.log('Tables renamed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateStepsToNewStructure();