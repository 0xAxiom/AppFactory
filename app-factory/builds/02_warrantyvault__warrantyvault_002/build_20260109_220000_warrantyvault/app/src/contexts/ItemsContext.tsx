/**
 * Items Context - Manages warranty items state
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Item, ItemWithStatus, Category } from '../types';
import { itemStorage } from '../utils/storage';
import { getWarrantyStatus, getDaysRemaining, getExpirationDate, getNowISO } from '../utils/dates';

interface ItemsContextValue {
  items: ItemWithStatus[];
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  activeCount: number;
  expiringCount: number;
  expiredCount: number;
  addItem: (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => ItemWithStatus | undefined;
  refreshItems: () => Promise<void>;
}

const ItemsContext = createContext<ItemsContextValue | null>(null);

function enrichItemWithStatus(item: Item): ItemWithStatus {
  const status = getWarrantyStatus(item.purchaseDate, item.warrantyMonths);
  const daysRemaining = getDaysRemaining(item.purchaseDate, item.warrantyMonths);
  const expirationDate = getExpirationDate(item.purchaseDate, item.warrantyMonths).toISOString();

  return {
    ...item,
    status,
    daysRemaining,
    expirationDate,
  };
}

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load items on mount
  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await itemStorage.getAll();
      const enriched = stored.map(enrichItemWithStatus);
      // Sort by days remaining (expiring first)
      enriched.sort((a, b) => a.daysRemaining - b.daysRemaining);
      setItems(enriched);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Computed counts
  const { itemCount, activeCount, expiringCount, expiredCount } = useMemo(() => {
    return {
      itemCount: items.length,
      activeCount: items.filter(i => i.status === 'active').length,
      expiringCount: items.filter(i => i.status === 'expiring').length,
      expiredCount: items.filter(i => i.status === 'expired').length,
    };
  }, [items]);

  // Add new item
  const addItem = useCallback(async (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
    const now = getNowISO();
    const newItem: Item = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    await itemStorage.add(newItem);
    const enriched = enrichItemWithStatus(newItem);
    setItems(prev => {
      const updated = [...prev, enriched];
      updated.sort((a, b) => a.daysRemaining - b.daysRemaining);
      return updated;
    });

    return newItem;
  }, []);

  // Update existing item
  const updateItem = useCallback(async (id: string, updates: Partial<Item>) => {
    await itemStorage.update(id, updates);
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates, updatedAt: getNowISO() };
          return enrichItemWithStatus(updatedItem);
        }
        return item;
      });
      updated.sort((a, b) => a.daysRemaining - b.daysRemaining);
      return updated;
    });
  }, []);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    await itemStorage.delete(id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Get item by ID
  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const value: ItemsContextValue = {
    items,
    isLoading,
    error,
    itemCount,
    activeCount,
    expiringCount,
    expiredCount,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    refreshItems: loadItems,
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}
