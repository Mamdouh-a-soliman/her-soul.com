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
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { categories } from "@/data/products";

const galleryModules = import.meta.glob("/src/assets/products/*.{jpg,jpeg,png,webp}", { as: "url", eager: true }) as Record<string, string>;
const availableImages = Object.values(galleryModules);

interface CategorySetting {
  id: string;
  category_name: string;
  frame_enabled: boolean;
  frame_image: string | null;
  background_image: string | null;
  background_opacity: number;
  background_blur: number;
}

export function CategorySettings() {
  const [categorySettings, setCategorySettings] = useState<CategorySetting[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySetting | null>(null);
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
  const [showBgDropdown, setShowBgDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    category_name: "",
    frame_enabled: false,
    frame_image: "",
    background_image: "",
    background_opacity: 1.0,
    background_blur: 0,
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
      frame_image: category.frame_image || "",
      background_image: category.background_image || "",
      background_opacity: category.background_opacity,
      background_blur: category.background_blur,
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
      frame_image: "",
      background_image: "",
      background_opacity: 1.0,
      background_blur: 0,
    });
    setIsDialogOpen(false);
  };

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
                    <Label>Frame Image (PNG with transparent background)</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setShowFrameDropdown(!showFrameDropdown)}
                          >
                            {formData.frame_image ? "Change Frame" : "Select from Gallery"}
                          </Button>
                          {showFrameDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              <div className="grid grid-cols-3 gap-2 p-2">
                                {availableImages.map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, frame_image: img });
                                      setShowFrameDropdown(false);
                                    }}
                                    className="border rounded p-1 hover:border-primary transition"
                                  >
                                    <img src={img} alt={`Frame ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('frame-upload')?.click()}
                        >
                          Browse
                        </Button>
                        <input
                          id="frame-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, frame_image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <Input
                        placeholder="Or paste image URL"
                        value={formData.frame_image}
                        onChange={(e) => setFormData({ ...formData, frame_image: e.target.value })}
                      />
                      {formData.frame_image && (
                        <div className="relative w-32 h-32 border rounded">
                          <img src={formData.frame_image} alt="Frame" className="w-full h-full object-contain rounded" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => setFormData({ ...formData, frame_image: "" })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Background Image</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setShowBgDropdown(!showBgDropdown)}
                          >
                            {formData.background_image ? "Change Background" : "Select from Gallery"}
                          </Button>
                          {showBgDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              <div className="grid grid-cols-3 gap-2 p-2">
                                {availableImages.map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, background_image: img });
                                      setShowBgDropdown(false);
                                    }}
                                    className="border rounded p-1 hover:border-primary transition"
                                  >
                                    <img src={img} alt={`BG ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('bg-upload')?.click()}
                        >
                          Browse
                        </Button>
                        <input
                          id="bg-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, background_image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <Input
                        placeholder="Or paste image URL"
                        value={formData.background_image}
                        onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                      />
                      {formData.background_image && (
                        <div className="relative w-32 h-32 border rounded">
                          <img src={formData.background_image} alt="Background" className="w-full h-full object-cover rounded" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => setFormData({ ...formData, background_image: "" })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background_opacity">Background Opacity: {formData.background_opacity}</Label>
                    <input
                      type="range"
                      id="background_opacity"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.background_opacity}
                      onChange={(e) => setFormData({ ...formData, background_opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="background_blur">Background Blur (px): {formData.background_blur}</Label>
                    <input
                      type="range"
                      id="background_blur"
                      min="0"
                      max="20"
                      step="1"
                      value={formData.background_blur}
                      onChange={(e) => setFormData({ ...formData, background_blur: parseInt(e.target.value) })}
                      className="w-full"
                    />
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
              <TableHead>Frame Image</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Opacity</TableHead>
              <TableHead>Blur</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorySettings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.category_name}</TableCell>
                <TableCell>{setting.frame_enabled ? "✓" : "✗"}</TableCell>
                <TableCell className="text-xs truncate max-w-[150px]">
                  {setting.frame_image ? (
                    <img src={setting.frame_image} alt="Frame" className="h-8 w-8 object-cover" />
                  ) : "None"}
                </TableCell>
                <TableCell className="text-xs truncate max-w-[150px]">
                  {setting.background_image ? (
                    <img src={setting.background_image} alt="BG" className="h-8 w-12 object-cover" />
                  ) : "None"}
                </TableCell>
                <TableCell>{setting.background_opacity}</TableCell>
                <TableCell>{setting.background_blur}px</TableCell>
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
