declare module "bcrypt" {
  interface CompareSync {
    (data: string, encrypted: string): boolean;
  }
  interface Compare {
    (data: string, encrypted: string): Promise<boolean>;
  }
  interface Hash {
    (data: string, saltOrRounds: string | number): Promise<string>;
  }
  const hash: Hash;
  const compare: Compare;
  const compareSync: CompareSync;
  export { hash, compare, compareSync };
  export default { hash, compare, compareSync };
}
