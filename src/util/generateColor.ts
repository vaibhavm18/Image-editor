const colors: string[] = ["red", "green", "blue"];
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
