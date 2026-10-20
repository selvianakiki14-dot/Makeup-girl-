import React, { useState, useEffect } from 'react';
import { SavedLook, VanityProduct, MakeupState } from '../../types/makeup';
import {
  Sparkles,
  Bookmark,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

interface VanityOrganizerProps {
  currentMakeup: MakeupState;
  currentModelName: string;
  onApplySavedLook: (state: MakeupState) => void;
  lang: 'id' | 'en';
}

const DEFAULT_SAMPLE_PRODUCTS: VanityProduct[] = [
  {
    id: 'prod-1',
    name: 'Lash Sensational Waterproof Mascara',
    brand: 'Maybelline',
    category: 'Eye',
    shadeName: 'Very Black',
    purchaseDate: '2026-08-15',
    shelfLifeMonths: 3,
    notes: 'Maskara favorit untuk volume bulu mata lentik',
  },
  {
    id: 'prod-2',
    name: 'All Day Luminous Liquid Foundation',
    brand: 'Make Over',
    category: 'Face',
    shadeName: 'W32 Warm Beige',
    purchaseDate: '2026-02-10',
    shelfLifeMonths: 12,
    notes: 'Complexion wisuda & acara formal',
  },
  {
    id: 'prod-3',
    name: 'Velvet Cloud Lip Tint Stain',
    brand: 'Somethinc',
    category: 'Lip',
    shadeName: 'Rose Terracotta',
    purchaseDate: '2026-05-20',
    shelfLifeMonths: 12,
    notes: 'Ombre lips harian yang tidak bikin bibir kering',
  },
  {
    id: 'prod-4',
    name: 'Golden Hour 9-Pan Eyeshadow Palette',
    brand: 'ESQA',
    category: 'Eye',
    shadeName: 'Warm Bronze Glitz',
    purchaseDate: '2025-11-01',
    shelfLifeMonths: 24,
    notes: 'Palet shimmer & matte serbaguna',
  },
];

export const VanityOrganizer: React.FC<VanityOrganizerProps> = ({
  currentMakeup,
  currentModelName,
  onApplySavedLook,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'looks' | 'tracker'>('looks');

  // Saved Looks from LocalStorage
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => {
    try {
      const stored = localStorage.getItem('glowstudio_saved_looks');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'default-look-1',
        name: 'Signature Kondangan Glam',
        date: '2026-10-18',
        modelName: 'Aisyah',
        notes: 'Gradasi bibir ombre pekat dan kilau champagne di tulang pipi',
        state: currentMakeup,
      },
    ];
  });

  // Save Look Form modal
  const [isSavingLook, setIsSavingLook] = useState(false);
  const [newLookName, setNewLookName] = useState('');
  const [newLookNotes, setNewLookNotes] = useState('');

  // Cosmetic Products from LocalStorage
  const [products, setProducts] = useState<VanityProduct[]>(() => {
    try {
      const stored = localStorage.getItem('glowstudio_vanity_products');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return DEFAULT_SAMPLE_PRODUCTS;
  });

  // Add Product Form modal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Lip' | 'Eye' | 'Face' | 'Skincare'>('Lip');
  const [newProdShade, setNewProdShade] = useState('');
  const [newProdDate, setNewProdDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProdMonths, setNewProdMonths] = useState(12);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('glowstudio_saved_looks', JSON.stringify(savedLooks));
  }, [savedLooks]);

  useEffect(() => {
    localStorage.setItem('glowstudio_vanity_products', JSON.stringify(products));
  }, [products]);

  const handleSaveCurrentLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLookName.trim()) return;

    const newLook: SavedLook = {
      id: `look-${Date.now()}`,
      name: newLookName.trim(),
      date: new Date().toLocaleDateString(),
      modelName: currentModelName,
      notes: newLookNotes.trim() || undefined,
      state: { ...currentMakeup },
    };

    setSavedLooks([newLook, ...savedLooks]);
    setNewLookName('');
    setNewLookNotes('');
    setIsSavingLook(false);
  };

  const handleDeleteLook = (id: string) => {
    setSavedLooks(savedLooks.filter((l) => l.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdBrand.trim()) return;

    const newProd: VanityProduct = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim(),
      category: newProdCategory,
      shadeName: newProdShade.trim() || 'Natural',
      purchaseDate: newProdDate,
      shelfLifeMonths: newProdMonths,
    };

    setProducts([newProd, ...products]);
    setNewProdName('');
    setNewProdBrand('');
    setNewProdShade('');
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Calculate Product Expiration Status
  const getExpirationStatus = (purchaseDateStr: string, shelfLifeMonths: number) => {
    const opened = new Date(purchaseDateStr);
    const now = new Date();
    const expiry = new Date(opened);
    expiry.setMonth(expiry.getMonth() + shelfLifeMonths);

    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        status: 'expired',
        label: lang === 'id' ? 'Kedaluwarsa (Ganti Baru)' : 'Expired (Replace)',
        color: 'text-rose-400 bg-rose-950/40 border-rose-900/50',
        daysLeft: 0,
      };
    } else if (diffDays <= 30) {
      return {
        status: 'warning',
        label: lang === 'id' ? `Segera Habis (${diffDays} hari lagi)` : `Expiring soon (${diffDays}d left)`,
        color: 'text-amber-300 bg-amber-950/40 border-amber-900/50',
        daysLeft: diffDays,
      };
    } else {
      return {
        status: 'good',
        label: lang === 'id' ? `Aman (${diffDays} hari)` : `Fresh (${diffDays}d left)`,
        color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50',
        daysLeft: diffDays,
      };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/60 via-stone-900 to-purple-950/40 border border-rose-900/40 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Koleksi Pribadi & Meja Rias' : 'Personal Vanity & Shelf'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {lang === 'id' ? 'Tas Rias & Pengingat Kedaluwarsa' : 'My Vanity & Expiration Tracker'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            {lang === 'id'
              ? 'Simpan racikan riasan favorit Anda untuk dipakai kembali kapan saja, serta pantau masa pakai kosmetik agar kulit tetap sehat dan higienis.'
              : 'Save signature makeup creations and track cosmetic expiration dates to preserve skin hygiene.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('looks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'looks'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Riasan Tersimpan' : 'Saved Looks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'tracker'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Tracker Kosmetik' : 'Product Expiry'}</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SAVED SIGNATURE LOOKS ================= */}
      {activeTab === 'looks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-zinc-400">
              {lang === 'id'
                ? `Total ${savedLooks.length} tampilan tersimpan di tas rias Anda`
                : `${savedLooks.length} custom looks saved`}
            </div>
            <button
              onClick={() => setIsSavingLook(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md hover:brightness-110 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Simpan Riasan Aktif Ini' : 'Save Current Studio Look'}</span>
            </button>
          </div>

          {/* Modal Save Look Form */}
          {isSavingLook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-3xl bg-[#1c121e] border border-rose-900/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rose-950/40">
                  <h4 className="text-base font-bold text-white font-display">
                    {lang === 'id' ? 'Simpan Tampilan Riasan Baru' : 'Save New Makeup Look'}
                  </h4>
                  <button
                    onClick={() => setIsSavingLook(false)}
                    className="text-zinc-400 hover:text-white text-xs"
                  >
                    Batal
                  </button>
                </div>

                <form onSubmit={handleSaveCurrentLook} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-rose-300">
                      {lang === 'id' ? 'Nama Tampilan' : 'Look Title'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wisuda Glam Rosewood, Sunset Date Night"
                      value={newLookName}
                      onChange={(e) => setNewLookName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-rose-300">
                      {lang === 'id' ? 'Catatan Tambahan (Opsional)' : 'Notes'}
                    </label>
                    <textarea
                      placeholder="e.g. Dipakai dengan outfit kebaya dusty rose"
                      value={newLookNotes}
                      onChange={(e) => setNewLookNotes(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* Swatches preview of what will be saved */}
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Palet Warna:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentMakeup.lips.color }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentMakeup.blush.color }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentMakeup.eyes.primaryColor }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentMakeup.face.highlighterColor }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:brightness-110 transition shadow-lg"
                  >
                    {lang === 'id' ? 'Simpan ke Tas Rias' : 'Save Look'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Looks Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedLooks.map((look) => (
              <div
                key={look.id}
                className="p-5 rounded-2xl bg-[#19111c] border border-rose-950/40 shadow-xl flex flex-col justify-between space-y-4 hover:border-rose-500/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      {look.date}
                    </span>
                    <button
                      onClick={() => handleDeleteLook(look.id)}
                      className="text-zinc-500 hover:text-rose-400 transition p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-white font-display">{look.name}</h4>
                  {look.notes && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{look.notes}</p>
                  )}
                </div>

                {/* Swatches & Model Info */}
                <div className="space-y-2 pt-2 border-t border-rose-950/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-mono text-[11px]">Model: {look.modelName}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: look.state.lips.color }} />
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: look.state.blush.color }} />
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: look.state.eyes.primaryColor }} />
                    </div>
                  </div>

                  <button
                    onClick={() => onApplySavedLook(look.state)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-white/5 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 active:scale-95 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'id' ? 'Buka di Studio Rias' : 'Open in Studio'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: COSMETIC EXPIRATION TRACKER ================= */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-zinc-400">
              {lang === 'id'
                ? 'Pantau kebersihan & higienitas kosmetik Anda untuk mencegah iritasi kulit & mata'
                : 'Track cosmetic shelf life to prevent bacterial buildup and eye infections'}
            </div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md hover:brightness-110 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Tambah Produk' : 'Add Product'}</span>
            </button>
          </div>

          {/* Add Product Modal */}
          {isAddingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-3xl bg-[#1c121e] border border-rose-900/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rose-950/40">
                  <h4 className="text-base font-bold text-white font-display">
                    {lang === 'id' ? 'Catat Produk Kosmetik Baru' : 'Add Cosmetic Item'}
                  </h4>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="text-zinc-400 hover:text-white text-xs"
                  >
                    Batal
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-rose-300">
                      {lang === 'id' ? 'Nama Produk' : 'Product Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lash Paradise Mascara, Soft Matte Lip Cream"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-rose-300">Brand / Merek</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maybelline, Wardah"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-rose-300">Kategori</label>
                      <select
                        value={newProdCategory}
                        onChange={(e: any) => setNewProdCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="Eye">Eye (Maskara/Liner: 3-6 bln)</option>
                        <option value="Face">Face (Foundation: 12 bln)</option>
                        <option value="Lip">Lip (Lipstik: 12-18 bln)</option>
                        <option value="Skincare">Skincare (6-12 bln)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-rose-300">Tanggal Dibuka</label>
                      <input
                        type="date"
                        value={newProdDate}
                        onChange={(e) => setNewProdDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-rose-300">Masa Pakai (Bulan)</label>
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={newProdMonths}
                        onChange={(e) => setNewProdMonths(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:brightness-110 transition shadow-lg mt-2"
                  >
                    {lang === 'id' ? 'Tambahkan ke Tracker' : 'Add Item'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Products List Table */}
          <div className="rounded-2xl bg-[#19111c] border border-rose-950/40 overflow-hidden shadow-xl">
            <div className="divide-y divide-rose-950/30">
              {products.map((prod) => {
                const info = getExpirationStatus(prod.purchaseDate, prod.shelfLifeMonths);
                return (
                  <div
                    key={prod.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10">
                          {prod.category}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">{prod.name}</h4>
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2">
                        <span>{prod.brand}</span>
                        <span>•</span>
                        <span>Shade: {prod.shadeName}</span>
                        <span>•</span>
                        <span>Dibuka: {prod.purchaseDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${info.color}`}
                      >
                        {info.label}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition"
                        title="Hapus produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hygiene Guidelines Info Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Panduan Masa Kedaluwarsa Kosmetik (PAO - Period After Opening):</span>
            </div>
            <p className="leading-relaxed">
              • <strong>Maskara & Liquid Liner</strong>: 3 - 6 bulan (area mata paling rentan bakteri).<br />
              • <strong>Foundation & Concealer</strong>: 12 bulan.<br />
              • <strong>Lipstik & Lip Tint</strong>: 12 - 18 bulan.<br />
              • <strong>Bedak Padat / Eyeshadow Powder</strong>: Hingga 24 bulan jika kuas rutin dicuci.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
