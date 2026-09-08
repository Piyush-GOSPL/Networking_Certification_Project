const { v4: uuidv4 } = require('uuid');
const { Certification, Topic, Question } = require('../models');

async function fillDummyQuestions() {
  const certs = await Certification.findAll({ include: [{ model: Topic, as: 'topics' }] });
  let addedCount = 0;

  for (const cert of certs) {
    const qCount = await Question.count({ where: { certificationId: cert.id } });
    if (qCount === 0 && cert.topics && cert.topics.length > 0) {
      console.log(`Adding dummy questions for ${cert.name}...`);
      
      for (const topic of cert.topics) {
        // Add 5 questions per topic
        for (let i = 1; i <= 5; i++) {
          await Question.create({
            id: uuidv4(),
            certificationId: cert.id,
            topicId: topic.id,
            questionCode: `${cert.code}-${topic.name.substring(0, 3).toUpperCase()}-00${i}`,
            type: 'multiple_choice',
            difficulty: i % 2 === 0 ? 'medium' : 'easy',
            questionText: `Sample question ${i} for ${cert.name} - ${topic.name}. What is the correct answer?`,
            options: ['A. Correct Option', 'B. Wrong Option 1', 'C. Wrong Option 2', 'D. Wrong Option 3'],
            correctAnswer: 'A',
            explanation: `This is a generated explanation for ${topic.name}. Option A is correct because it is the right answer.`,
            isActive: true
          });
          addedCount++;
        }
      }
    }
  }
  console.log(`Successfully added ${addedCount} dummy questions.`);
}

fillDummyQuestions().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
