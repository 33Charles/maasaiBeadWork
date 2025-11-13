// client/src/pages/ArtisanDashboard.tsx
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/use-toast";
import { TrendingUp, Package, DollarSign, MessageSquare, Edit, Trash2, Plus } from "lucide-react";

// Mock data
const salesData = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 1800 },
  { month: "Mar", sales: 2200 },
  { month: "Apr", sales: 2800 },
  { month: "May", sales: 3200 },
  { month: "Jun", sales: 3800 },
];

const mockProducts = [
  { id: 1, name: "Red Warrior Necklace", price: 45, stock: 12, sales: 28 },
  { id: 2, name: "Blue Sky Earrings", price: 28, stock: 18, sales: 42 },
  { id: 3, name: "Tribal Belt", price: 78, stock: 5, sales: 15 },
];

const mockOrders = [
  { id: "ORD001", customer: "Jane Doe", total: 73, status: "Shipped" },
  { id: "ORD002", customer: "John Smith", total: 45, status: "Delivered" },
];

const mockMessages = [
  { id: 1, from: "Customer", message: "When will my order ship?", time: "2h ago", unread: true },
  { id: 2, from: "Admin", message: "Your payout is ready", time: "1d ago", unread: false },
];

export default function ArtisanDashboard() {
  const { toast } = useToast();
  const [products, setProducts] = useState(mockProducts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const totalEarnings = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = mockOrders.length;
  const totalProducts = products.length;

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  const handleSaveProduct = (data: any) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
      toast.success("Product updated");
    } else {
      setProducts(prev => [...prev, { id: Date.now(), ...data, sales: 0 }]);
      toast.success("Product added");
    }
    setIsAddOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Artisan Dashboard</h1>
          <p className="text-muted-foreground">Manage your beadwork business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">2 pending shipment</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">3 low stock</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview - Golden Area Chart */}
          <TabsContent value="overview">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      {/* Custom golden gradient */}
                      <defs>
                        <linearGradient id="goldenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f47f1b" stopOpacity={0.5} />
                          <stop offset="50%" stopColor="#f47f1b" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#f47f1b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="goldenLine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f47f1b" stopOpacity={1} />
                          <stop offset="100%" stopColor="#f47f1b" stopOpacity={1} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                        labelStyle={{ color: "#F9FAFB" }}
                        formatter={(value) => [`${value} items`, "Sales"]}
                      />

                      {/* Golden glowing area */}
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="url(#goldenLine)"
                        strokeWidth={3}
                        fill="url(#goldenGradient)"
                        fillOpacity={1}
                        dot={{
                          fill: "#F59E0B",
                          stroke: "#F59E0B",
                          strokeWidth: 2,
                          r: 4,
                          cursor: "pointer",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#F59E0B",
                          stroke: "#F59E0B",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <Card className="border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        product={editingProduct}
                        onSave={handleSaveProduct}
                        onCancel={() => {
                          setIsAddOpen(false);
                          setEditingProduct(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>${p.price}</TableCell>
                        <TableCell>
                          <Badge variant={p.stock < 10 ? "destructive" : "secondary"}>
                            {p.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.sales}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell>${o.total}</TableCell>
                        <TableCell>
                          <Badge variant={o.status === "Delivered" ? "default" : "secondary"}>
                            {o.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Inbox</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-lg border ${m.unread ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{m.from}</p>
                          <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ product, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => onSave(formData)}
        >
          Save
        </Button>
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}