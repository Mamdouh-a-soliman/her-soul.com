import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categories } from "@/data/products";

interface CategorySetting {
  id: string;
  category_name: string;
  frame_enabled: boolean;
  frame_color: string;
  frame_style: string;
  background_gradient: string;
  decorative_elements: unknown;
}

export function CategorySettings() {
  const [categorySettings, setCategorySettings] = useState<CategorySetting[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySetting | null>(null);
  const [formData, setFormData] = useState({
    category_name: "",
    frame_enabled: false,
    frame_color: "amber-600",
    frame_style: "double",
    background_gradient: "",
    decorative_elements: [],
  });

  useEffect(() => {
    fetchCategorySettings();
  }, []);

  const fetchCategorySettings = async () => {
    const { data, error } = await supabase
      .from("category_settings")
      .select("*")
      .order("category_name", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCategorySettings(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      const { error } = await supabase
        .from("category_settings")
        .update(formData)
        .eq("id", editingCategory.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category settings updated" });
        fetchCategorySettings();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("category_settings")
        .insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category settings created" });
        fetchCategorySettings();
        resetForm();
      }
    }
  };

  const handleEdit = (category: CategorySetting) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      frame_enabled: category.frame_enabled,
      frame_color: category.frame_color,
      frame_style: category.frame_style,
      background_gradient: category.background_gradient,
      decorative_elements: (category.decorative_elements as any[]) || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category setting?")) return;

    const { error } = await supabase
      .from("category_settings")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Category settings deleted" });
      fetchCategorySettings();
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      category_name: "",
      frame_enabled: false,
      frame_color: "amber-600",
      frame_style: "double",
      background_gradient: "",
      decorative_elements: [],
    });
    setIsDialogOpen(false);
  };

  const frameColorOptions = [
    "amber-600", "purple-600", "emerald-600", "rose-600", "blue-600", "slate-600"
  ];

  const frameStyleOptions = [
    "double", "solid", "dashed", "dotted"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Category Settings</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category Settings" : "Add Category Settings"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category_name">Category</Label>
                <select
                  id="category_name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full border rounded-md p-2 bg-background"
                  required
                  disabled={!!editingCategory}
                >
                  <option value="">Select Category</option>
                  {categories.filter(cat => cat !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="frame_enabled"
                  checked={formData.frame_enabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, frame_enabled: checked as boolean })
                  }
                />
                <Label htmlFor="frame_enabled">Enable Custom Frame</Label>
              </div>

              {formData.frame_enabled && (
                <>
                  <div>
                    <Label htmlFor="frame_color">Frame Color</Label>
                    <select
                      id="frame_color"
                      value={formData.frame_color}
                      onChange={(e) => setFormData({ ...formData, frame_color: e.target.value })}
                      className="w-full border rounded-md p-2 bg-background"
                    >
                      {frameColorOptions.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="frame_style">Frame Style</Label>
                    <select
                      id="frame_style"
                      value={formData.frame_style}
                      onChange={(e) => setFormData({ ...formData, frame_style: e.target.value })}
                      className="w-full border rounded-md p-2 bg-background"
                    >
                      {frameStyleOptions.map((style) => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="background_gradient">Background Gradient (Tailwind classes)</Label>
                    <Input
                      id="background_gradient"
                      value={formData.background_gradient}
                      onChange={(e) => setFormData({ ...formData, background_gradient: e.target.value })}
                      placeholder="e.g., from-emerald-950/10 to-amber-950/10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: "from-emerald-950/10 to-amber-950/10"
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"} Settings
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Frame Enabled</TableHead>
              <TableHead>Frame Color</TableHead>
              <TableHead>Frame Style</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorySettings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.category_name}</TableCell>
                <TableCell>{setting.frame_enabled ? "✓" : "✗"}</TableCell>
                <TableCell>{setting.frame_color}</TableCell>
                <TableCell>{setting.frame_style}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {setting.background_gradient || "None"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(setting)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(setting.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
