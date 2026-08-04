import { BackButton } from "@/components/shared/back-button";
import { CategoryManager } from "../_components/category-manager";

export default function AdminCategoriesPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">Manage Categories</h1>
      <CategoryManager />
    </div>
  );
}
