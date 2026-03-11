
'use client';

import { useEffect, useState, useRef } from 'react';
import { getOrders, type Order, type Service, addService, deleteService } from './actions';
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
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>
            Monitor all orders placed through the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Created At</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Contact</TableHead>
                  <TableHead className="min-w-[180px]">Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[250px]">Message</TableHead>
                  <TableHead>File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingOrders ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                       <TableCell colSpan={7}>
                            <Skeleton className="h-8 w-full" />
                       </TableCell>
                    </TableRow>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                      </TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.contact}</TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'pending_payment' ? 'default' : 'secondary'} className={order.status === 'pending_payment' ? 'bg-yellow-500/80 text-yellow-50 hover:bg-yellow-500/90' : ''}>
                          {order.status.replace(/_/g, ' ').toLocaleUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={order.message}>{order.message}</TableCell>
                      <TableCell>
                        <a
                          href={order.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

    </>
  );
}
