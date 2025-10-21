import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking database data...');
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`Categories count: ${categories.length}`);
    if (categories.length > 0) {
      console.log('First category:', categories[0]);
    }
    
    // Check examples work
    const examples = await prisma.examplesOurWork.findMany();
    console.log(`Examples work count: ${examples.length}`);
    if (examples.length > 0) {
      console.log('First example:', examples[0]);
    }
    
    // Check contact info
    const contacts = await prisma.contactInfo.findMany();
    console.log(`Contact info count: ${contacts.length}`);
    if (contacts.length > 0) {
      console.log('First contact:', contacts[0]);
    }
    
    // Check content
    const content = await prisma.content.findMany();
    console.log(`Content count: ${content.length}`);
    if (content.length > 0) {
      console.log('First content:', content[0]);
    }
    
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();



