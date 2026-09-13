"use client";

import { useState, useMemo } from "react";
import { MapPin, Plus, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/features/address/address-api";
import type { Address, AddressFormValues } from "@/features/address/address-types";
import { AddressForm } from "./address-form";

export function AddressManager() {
  const { data, isLoading } = useGetAddressesQuery();
  const addresses = useMemo(() => data?.addresses ?? [], [data?.addresses]);

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const handleCreate = async (formData: AddressFormValues) => {
    await createAddress(formData).unwrap();
    setFormOpen(false);
  };

  const handleUpdate = async (formData: AddressFormValues) => {
    if (!editingAddress) return;
    await updateAddress({ id: editingAddress.id, ...formData }).unwrap();
    setEditingAddress(null);
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingAddress) return;
    await deleteAddress(deletingAddress.id).unwrap();
    setDeletingAddress(null);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-darkText">
            My Addresses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery addresses
          </p>
        </div>
        <Button
          onClick={() => { setEditingAddress(null); setFormOpen(true); }}
          className="rounded-lg bg-maroon text-white hover:bg-maroon-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-20 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">No addresses saved yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Add a delivery address for faster checkout
          </p>
          <Button
            onClick={() => { setEditingAddress(null); setFormOpen(true); }}
            variant="outline"
            className="mt-4 rounded-lg border-maroon/30 text-maroon hover:bg-maroon/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative rounded-2xl border bg-white p-5 transition ${
                address.is_default
                  ? "border-maroon/30 shadow-sm"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{address.label}</span>
                  {address.is_default && (
                    <Badge variant="secondary" className="bg-maroon/10 text-maroon text-[10px] font-bold">
                      <Star className="h-3 w-3 mr-0.5 fill-current" />
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-1.5 text-slate-400 hover:text-maroon transition rounded-lg hover:bg-maroon/5"
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => { setEditingAddress(address); setFormOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingAddress(address)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p>{address.address_line}</p>
                {address.area && <p>{address.area}</p>}
                <p>{address.city}, {address.province}</p>
                <p className="text-slate-500">{address.phone}</p>
                {address.delivery_notes && (
                  <p className="text-xs text-slate-400 italic mt-1">{address.delivery_notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingAddress(null); }}
        onSubmit={editingAddress ? handleUpdate : handleCreate}
        address={editingAddress}
        isSubmitting={isCreating || isUpdating}
      />

      <Dialog open={!!deletingAddress} onOpenChange={(open) => !open && setDeletingAddress(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAddress(null)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="rounded-lg bg-destructive text-white hover:bg-destructive/90">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
