export type Plan = {
  id: number;
  name: string;
  monthlyLimit: number;
  planFeatures: string[];
  price: number;
  description?: string;
};
