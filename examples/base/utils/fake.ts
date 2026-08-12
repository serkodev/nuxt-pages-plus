import { faker } from '@faker-js/faker'

faker.seed(123)

function createFakeNews() {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.firstName(),
    ago: `${faker.number.int({ min: 1, max: 23 })} hours ago`,
  }
}

export const exampleNews = Array.from({ length: 10 }, createFakeNews)
