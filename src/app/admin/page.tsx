'use client';

import { useEffect, useState } from 'react';
import { getOrders, type Order } from './actions';
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
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-auto" />
          <span className="sr-only">AI Jasa Edit</span>
        </Link>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="w-24"></div> {/* Spacer */}
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
                    {loading ? (
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
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-400/50 text-blue-200/80 rounded-lg flex items-start gap-3">
          <Shield className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Security Notice</h4>
            <p className="text-sm">This admin dashboard is currently public. For production use, you must secure this page with an authentication system (e.g., Firebase Authentication) to ensure only authorized administrators can access it.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
