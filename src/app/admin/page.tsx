
'use client';

import { useEffect, useState, useRef } from 'react';
import { getOrders, type Order, type Service, addService, deleteService, updateOrderStatus } from './actions';
import { getServices } from '../actions';
import isEqual from 'lodash.isequal';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Trash2, PlusCircle, Loader2, MessageCircle, ExternalLink, PenLine, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { iconList, renderIcon, IconName } from '@/components/icons/icon-map';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const { toast } = useToast();
  const addServiceFormRef = useRef<HTMLFormElement>(null);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoadingOrders(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(prevOrders => {
        // Deteksi jika ada pesanan baru (hanya jika sudah pernah ada data sebelumnya)
        if (prevOrders.length > 0 && fetchedOrders.length > 0) {
          const isSame = isEqual(prevOrders[0], fetchedOrders[0]);
          if (!isSame && fetchedOrders.length >= prevOrders.length) {
            // Ada pesanan baru masuk!
            playNotificationSound();
            toast({
              title: "🚀 Pesanan Baru!",
              description: `Baru saja masuk pesanan dari ${fetchedOrders[0].name}`,
              variant: "default",
            });
          }
        }
        return fetchedOrders;
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (!silent) toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat pesanan.' });
    } finally {
      if (!silent) setLoadingOrders(false);
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat layanan.' });
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchServices();

    // Polling setiap 15 detik untuk simulasi real-time notification
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleAddService = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await addService(formData);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Layanan baru berhasil ditambahkan.' });
      addServiceFormRef.current?.reset();
      await fetchServices();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Hapus layanan ini?")) return;
    setDeletingServiceId(id);
    const result = await deleteService(id);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Layanan berhasil dihapus.' });
      await fetchServices();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setDeletingServiceId(null);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast({ title: 'Sukses', description: `Status pesanan berhasil diperbarui menjadi ${newStatus}.` });
        // Update local state to show change immediately
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memperbarui status.' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <PenLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Akumulasi pesanan masuk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending_payment').length}
            </div>
            <p className="text-xs text-muted-foreground">Menunggu bukti transfer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Pesanan sedang dikerjakan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>
            Monitor all orders placed through the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tampilan Desktop (Tabel) */}
          <div className="hidden md:block w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Tanggal</TableHead>
                  <TableHead className="min-w-[150px]">Kontak</TableHead>
                  <TableHead className="min-w-[150px]">Layanan</TableHead>
                  <TableHead className="min-w-[150px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Pesan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingOrders ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                       <TableCell colSpan={6}>
                            <Skeleton className="h-8 w-full" />
                       </TableCell>
                    </TableRow>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-xs">
                        {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">{order.name}<br/><span className="text-xs font-normal text-muted-foreground">{order.contact}</span></TableCell>
                      <TableCell className="text-sm">{order.service}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className={`h-8 w-[140px] text-xs font-bold ${getStatusColor(order.status)}`}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_payment">PENDING PAYMENT</SelectItem>
                            <SelectItem value="processing">PROCESSING</SelectItem>
                            <SelectItem value="completed">COMPLETED</SelectItem>
                            <SelectItem value="cancelled">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate text-xs" title={order.message}>{order.message}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8 px-2">
                            <a href={order.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" /> File
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="h-8 px-2 border-green-500/30 text-green-600 hover:bg-green-500/10">
                            <a href={`https://wa.me/${order.contact.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Hubungi
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Tampilan Mobile (Card List) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {loadingOrders ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="overflow-hidden border-border bg-card">
                  <div className={`h-1.5 w-full ${
                    order.status === 'pending_payment' ? 'bg-yellow-500' :
                    order.status === 'processing' ? 'bg-blue-500' :
                    order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{order.name}</p>
                        <p className="text-xs text-muted-foreground">{order.contact}</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                        {format(new Date(order.created_at), 'dd MMM yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Layanan</p>
                      <p className="text-sm font-medium">{order.service}</p>
                    </div>

                    <div className="bg-muted/50 p-2.5 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground line-clamp-2 italic">"{order.message}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="w-[140px]">
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className={`h-8 w-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_payment">PENDING</SelectItem>
                            <SelectItem value="processing">PROCESSING</SelectItem>
                            <SelectItem value="completed">COMPLETED</SelectItem>
                            <SelectItem value="cancelled">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="icon" asChild className="h-8 w-8 text-primary">
                          <a href={order.file_url} target="_blank" rel="noopener noreferrer" title="Buka File">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" asChild className="h-8 w-8 text-green-600 border-green-500/30 hover:bg-green-500/10">
                          <a href={`https://wa.me/${order.contact.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No orders found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kelola Layanan</CardTitle>
          <CardDescription>Tambah atau hapus layanan yang ditampilkan di halaman utama.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tambah Layanan Baru</h3>
            <form ref={addServiceFormRef} action={handleAddService} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Judul Layanan</Label>
                <Input id="title" name="title" placeholder="e.g., Adegan Supercar" required disabled={isSubmitting} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" placeholder="Deskripsi singkat layanan..." required disabled={isSubmitting} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="price">Harga</Label>
                  <Input id="price" name="price" placeholder="e.g., Rp 75.000" required disabled={isSubmitting} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="icon">Ikon</Label>
                  <Select name="icon" required disabled={isSubmitting}>
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Pilih Ikon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconList.map(iconName => (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            {renderIcon(iconName as IconName, {className: "h-4 w-4"})}
                            {iconName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="ai_hint">AI Hint</Label>
                  <Input id="ai_hint" name="ai_hint" placeholder="e.g., luxury car night" required disabled={isSubmitting} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="order">Urutan</Label>
                  <Input id="order" name="order" type="number" placeholder="0" defaultValue="0" required disabled={isSubmitting} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="image_placeholder">URL Gambar</Label>
                <Input id="image_placeholder" name="image_placeholder" placeholder="https://placehold.co/400x300.webp" disabled={isSubmitting} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Menambahkan...' : 'Tambah Layanan'}
              </Button>
            </form>
          </div>
          <div className="w-full overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Daftar Layanan Saat Ini</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingServices ? (
                   Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                       <TableCell colSpan={4}>
                            <Skeleton className="h-8 w-full" />
                       </TableCell>
                    </TableRow>
                  ))
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.order}</TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                         {renderIcon(service.icon as IconName, { className: "h-4 w-4"})}
                         {service.title}
                      </TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service.id)} disabled={deletingServiceId === service.id}>
                          {deletingServiceId === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        Belum ada layanan.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
