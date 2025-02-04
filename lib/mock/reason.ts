export async function getReasonMock(): Promise<string> {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });
  return 'Это сгенерированный ответ на ваш вопрос. Он может быть длинным и содержать несколько предложений.';
}
