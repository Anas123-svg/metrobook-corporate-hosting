import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, Check, User, Building2,
  Info, Search, X, ChevronDown, SlidersHorizontal, Building, Home, Layers, Star, MapPin, Navigation, Plus, Minus, Upload, Eye, DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefundPolicyModal } from "../../components/RefundPolicyModal";
import { Step1ClientType } from "./steps/Step1ClientType";
import { Step2PropertyDetails } from "./steps/Step2PropertyDetails";
import { Step3ListingDetails } from "./steps/Step3ListingDetails";
import { Step4AmenitiesRules } from "./steps/Step4AmenitiesRules";
import { Step5MediaPricing } from "./steps/Step5MediaPricing";
import { Step6PreviewProperty } from "./steps/Step6PreviewProperty";
import { getDaysInMonth } from "./utils";
import {
  createListing,
  fetchCurrentHostProfile,
  fetchHostCustomers,
  fetchListingById,
  updateListingById,
} from "../../services/hostApi";
import type { CreateListingRequest } from "../../models/listing";
import { getHostDetails } from "../../services/hostAuthStorage";

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_GOOGLE_MAP_API_KEY?: string;
      readonly VITE_GOOGLE_MAP_ID?: string;
      readonly NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?: string;
      readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
    };
  }
}

const steps = [
  { id: 1, name: "Client Type", icon: User },
  { id: 2, name: "Property Details", icon: Building2 },
  { id: 3, name: "Listing Details", icon: Layers },
  { id: 4, name: "Amenities & Rules", icon: Star },
  { id: 5, name: "Media & Pricing", icon: DollarSign },
  { id: 6, name: "Preview Property", icon: Eye },
];

type PropertyType = "penthouse" | "apartment" | "studio" | "villa";

const properties = [
  {
    id: 1,
    title: "Luxury Penthouse",
    city: "New York",
    price: 850,
    type: "penthouse" as PropertyType,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: 2,
    title: "Executive Apartment",
    city: "San Francisco",
    price: 720,
    type: "apartment" as PropertyType,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: 3,
    title: "Modern Studio",
    city: "Los Angeles",
    price: 580,
    type: "studio" as PropertyType,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  },
  {
    id: 4,
    title: "Premium Villa",
    city: "Miami",
    price: 950,
    type: "villa" as PropertyType,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: 5,
    title: "Sky Penthouse",
    city: "Chicago",
    price: 1100,
    type: "penthouse" as PropertyType,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: 6,
    title: "Cozy Studio Loft",
    city: "Austin",
    price: 420,
    type: "studio" as PropertyType,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
];

const propertyTypeConfig: Record<PropertyType, { label: string; icon: React.ElementType }> = {
  penthouse: { label: "Penthouse", icon: Building },
  apartment: { label: "Apartment", icon: Layers },
  studio: { label: "Studio", icon: Home },
  villa: { label: "Villa", icon: Star },
};

type ExistingClientOption = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
};

const PRICE_MIN = 0;
const PRICE_MAX = 1200;

const amenityGroups: { title: string; items: string[] }[] = [
  {
    title: "Common Amenities",
    items: [
      "Essentials",
      "Kitchen",
      "Air Conditioning",
      "Heating",
      "Wifi",
      "24-Hour Check-in",
      "TV",
      "Cable",
      "Hangers",
      "Laptop friendly workspace",
    ],
  },
  {
    title: "Additional Amenities",
    items: [
      "Hot tub",
      "Cooking basics",
      "Pool",
      "Free parking on premises",
      "Gym",
      "BBQ grill",
      "Washer",
      "Dryer",
    ],
  },
  {
    title: "Special Features",
    items: [
      "Smoking",
      "Pets allowed",
      "Family/Kid Friendly",
      "Events",
      "Wheelchair Accessible",
    ],
  },
  {
    title: "Safety & Security",
    items: [
      "Fire extinguisher",
      "Carbon monoxide detector",
      "Smoke detector",
      "First aid kit",
      "Electric Tools",
    ],
  },
];

const houseRuleOptions = [
  "No Smoking",
  "No Parties",
  "No Pets",
  "No Loud Music",
  "Quiet Hours After 10 PM",
  "No Guests After 11 PM",
];

const tokenizeValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const humanizeToken = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function NewBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editListingId = searchParams.get("editListingId")?.trim() || "";
  const isEditMode = Boolean(editListingId);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  // Client selection state
  const [clientMode, setClientMode] = useState<"existing" | "corporation">("existing");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ExistingClientOption | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const [existingClients, setExistingClients] = useState<ExistingClientOption[]>([]);

  // Property filter state
  const [propertySearch, setPropertySearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [selectedTypes, setSelectedTypes] = useState<Set<PropertyType>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [draggingThumb, setDraggingThumb] = useState<"min" | "max" | null>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", country: "", saveToList: false,
    checkIn: "", checkOut: "", guests: "1", notes: "", paymentMethod: "card", checkInTime: "", checkOutTime: ""
  });

  // Listing form state
  const [listingData, setListingData] = useState({
    propertyType: "apartment",
    placeName: "",
    placeDescription: "",
    rentalForm: "full-rental",
    country: "United States",
    city: "",
    state: "",
    postalCode: "",
    roomNumber: "",
    street: "",
    areaM2: "100",
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    kitchen: 1,
    latitude: 40.7128,
    longitude: -74.006,
    availabilityType: "always",
    availabilityStartDate: "",
    availabilityEndDate: "",
    coverImageUrl: "",
    imageUrls: [] as string[],
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [selectedHouseRules, setSelectedHouseRules] = useState<Set<string>>(new Set());
  const [additionalRules, setAdditionalRules] = useState<string[]>([
    "No smoking in common areas",
    "Do not wear shoes/shoes in the house",
    "No cooking in the bedroom",
    "No smoking",
  ]);
  const [newRule, setNewRule] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Media and pricing state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [placeImages, setPlaceImages] = useState<File[]>([]);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPlaceImages, setIsUploadingPlaceImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingEditListing, setIsLoadingEditListing] = useState(false);
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);
  const [editListingIsActive, setEditListingIsActive] = useState(true);

  const amenityTokenToLabel = useMemo(() => {
    const map = new Map<string, string>();

    amenityGroups.forEach((group) => {
      group.items.forEach((item) => {
        map.set(tokenizeValue(item), item);
      });
    });

    return map;
  }, []);

  const houseRuleTokenToLabel = useMemo(() => {
    const map = new Map<string, string>();

    houseRuleOptions.forEach((item) => {
      map.set(tokenizeValue(item), item);
    });

    return map;
  }, []);

  const resolveHostId = useCallback(async () => {
    if (hostId) {
      return hostId;
    }

    const hostFromStorage = getHostDetails()?.id;
    if (hostFromStorage) {
      setHostId(hostFromStorage);
      return hostFromStorage;
    }

    const hostProfile = await fetchCurrentHostProfile();
    if (!hostProfile.id) {
      throw new Error("Host ID is missing. Please sign in again.");
    }

    setHostId(hostProfile.id);
    return hostProfile.id;
  }, [hostId]);

  const loadExistingClients = useCallback(async () => {
    try {
      const resolvedHostId = await resolveHostId();
      const customers = await fetchHostCustomers(resolvedHostId);

      const mappedClients = customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        country: customer.country || "-",
      }));

      setExistingClients(mappedClients);
    } catch (error) {
      console.error("Unable to load existing clients for booking flow", error);
      setExistingClients([]);
    }
  }, [resolveHostId]);

  useEffect(() => {
    void loadExistingClients();
  }, [loadExistingClients]);

  useEffect(() => {
    if (!pendingCustomerId) {
      return;
    }

    const matchedCustomer = existingClients.find((customer) => customer.id === pendingCustomerId);
    if (!matchedCustomer) {
      return;
    }

    setSelectedClient(matchedCustomer);
    setClientSearch(matchedCustomer.name);
    setFormData((prev) => ({
      ...prev,
      name: matchedCustomer.name,
      email: matchedCustomer.email,
      phone: matchedCustomer.phone,
      country: matchedCustomer.country,
    }));
    setPendingCustomerId(null);
  }, [existingClients, pendingCustomerId]);

  useEffect(() => {
    if (!isEditMode || !editListingId) {
      return;
    }

    const loadListingForEdit = async () => {
      setIsLoadingEditListing(true);
      setSubmitError(null);

      try {
        const listing = await fetchListingById(editListingId);
        if (!listing) {
          throw new Error("Listing details are unavailable.");
        }

        const isCorporate = listing.is_corporate_owner_of_property;
        setClientMode(isCorporate ? "corporation" : "existing");
        setPendingCustomerId(!isCorporate ? listing.corporate_host_customer_id || null : null);
        setEditListingIsActive(Boolean(listing.is_active));

        setListingData((prev) => ({
          ...prev,
          propertyType: listing.property_type || prev.propertyType,
          placeName: listing.property_name,
          placeDescription: listing.description,
          city: listing.city,
          state: listing.state,
          postalCode: listing.postal_code,
          roomNumber: listing.room_no,
          street: listing.address,
          areaM2: String(listing.area || 0),
          guests: listing.guests || 0,
          bedrooms: listing.bedrooms || 0,
          beds: listing.beds || 0,
          bathrooms: listing.bathrooms || 0,
          kitchen: listing.kitchen || 0,
          latitude: Number(listing.latitude) || prev.latitude,
          longitude: Number(listing.longitude) || prev.longitude,
          availabilityType: listing.booking_availability === "Always" ? "always" : "one-time",
          availabilityStartDate: listing.start_date || "",
          availabilityEndDate: listing.end_date || "",
          coverImageUrl: listing.cover_image || "",
          imageUrls: listing.additional_images || [],
        }));

        setCoverImage(null);
        setPlaceImages([]);
        setMonthlyPrice(Number(listing.monthly_price) || 0);

        const parsedAmenities = [
          ...listing.common_amenities,
          ...listing.additional_features,
          ...listing.special_features,
          ...listing.safety_security_features,
        ].map((token) => amenityTokenToLabel.get(token) || humanizeToken(token));

        setSelectedAmenities(new Set(parsedAmenities));
        setSelectedHouseRules(
          new Set(listing.house_rules.map((token) => houseRuleTokenToLabel.get(token) || humanizeToken(token))),
        );
        setAdditionalRules(listing.additional_house_rules.map((token) => humanizeToken(token)));
        setTags(listing.property_tags.map((token) => humanizeToken(token)));
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Unable to load listing for editing.");
      } finally {
        setIsLoadingEditListing(false);
      }
    };

    void loadListingForEdit();
  }, [amenityTokenToLabel, editListingId, houseRuleTokenToLabel, isEditMode]);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY || "";
    if (!apiKey) return;

    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      const onLoad = () => setMapsLoaded(true);
      existingScript.addEventListener("load", onLoad);
      return () => existingScript.removeEventListener("load", onLoad);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    if (currentStep === 2 && mapRef.current && !googleMapRef.current && mapsLoaded && window.google?.maps) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: listingData.latitude, lng: listingData.longitude },
        zoom: 14,
      });
      markerRef.current = new window.google.maps.Marker({
        position: { lat: listingData.latitude, lng: listingData.longitude },
        map: googleMapRef.current,
        draggable: true,
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current?.getPosition();
        if (pos) {
          setListingData(prev => ({ ...prev, latitude: pos.lat(), longitude: pos.lng() }));
        }
      });

      googleMapRef.current.addListener("click", (event: any) => {
        if (!event.latLng || !markerRef.current) {
          return;
        }

        markerRef.current.setPosition(event.latLng);
        setListingData((prev) => ({
          ...prev,
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        }));
      });
    }
  }, [currentStep, mapsLoaded, listingData.latitude, listingData.longitude]);

  useEffect(() => {
    if (!googleMapRef.current || !markerRef.current || !window.google?.maps) {
      return;
    }

    const newLocation = new window.google.maps.LatLng(listingData.latitude, listingData.longitude);
    markerRef.current.setPosition(newLocation);
    googleMapRef.current.setCenter(newLocation);
  }, [listingData.latitude, listingData.longitude]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setListingData(prev => ({ ...prev, latitude, longitude }));
        if (googleMapRef.current && markerRef.current) {
          const newPos = { lat: latitude, lng: longitude };
          googleMapRef.current.setCenter(newPos);
          markerRef.current.setPosition(newPos);
        }
      });
    }
  };

  type ListingCountField = "guests" | "bedrooms" | "beds" | "bathrooms" | "kitchen";

  const adjustListingCount = (field: ListingCountField, delta: number) => {
    setListingData((prev) => {
      const currentValue = prev[field] as number;
      return {
        ...prev,
        [field]: Math.max(0, currentValue + delta),
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(amenity)) {
        next.delete(amenity);
      } else {
        next.add(amenity);
      }
      return next;
    });
  };

  const toggleHouseRule = (rule: string) => {
    setSelectedHouseRules((prev) => {
      const next = new Set(prev);
      if (next.has(rule)) {
        next.delete(rule);
      } else {
        next.add(rule);
      }
      return next;
    });
  };

  const handleAddRule = () => {
    const trimmed = newRule.trim();
    if (!trimmed) return;
    setAdditionalRules((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewRule("");
  };

  const removeRule = (rule: string) => {
    setAdditionalRules((prev) => prev.filter((item) => item !== rule));
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    setTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const responseBody = (await response.json().catch(() => null)) as
      | { secure_url?: string; error?: { message?: string } }
      | null;

    if (!response.ok || !responseBody?.secure_url) {
      throw new Error(responseBody?.error?.message || "Unable to upload image right now.");
    }

    return responseBody.secure_url;
  };

  // File upload handlers
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setCoverImage(file);
    setIsUploadingCover(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setListingData((prev) => ({
        ...prev,
        coverImageUrl: uploadedUrl,
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload cover image right now.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handlePlaceImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    setUploadError(null);
    const availableSlots = Math.max(0, 10 - placeImages.length);
    const filesToUpload = files.slice(0, availableSlots);
    if (filesToUpload.length === 0) {
      return;
    }

    setPlaceImages((prev) => [...prev, ...filesToUpload]);
    setIsUploadingPlaceImages(true);

    try {
      const uploadedUrls = await Promise.all(filesToUpload.map((file) => uploadToCloudinary(file)));
      setListingData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload photos right now.");
    } finally {
      setIsUploadingPlaceImages(false);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setListingData((prev) => ({
      ...prev,
      coverImageUrl: "",
    }));
  };

  const removePlaceImage = (index: number) => {
    setPlaceImages((prev) => prev.filter((_, i) => i !== index));
    setListingData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const initializeMap = () => {
    if (currentStep === 2 && mapRef.current && !googleMapRef.current && mapsLoaded && window.google?.maps) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: listingData.latitude, lng: listingData.longitude },
        zoom: 14,
      });
      markerRef.current = new window.google.maps.Marker({
        position: { lat: listingData.latitude, lng: listingData.longitude },
        map: googleMapRef.current,
        draggable: true,
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current?.getPosition();
        if (pos) {
          setListingData(prev => ({ ...prev, latitude: pos.lat(), longitude: pos.lng() }));
        }
      });

      googleMapRef.current.addListener("click", (event: any) => {
        if (!event.latLng || !markerRef.current) {
          return;
        }

        markerRef.current.setPosition(event.latLng);
        setListingData((prev) => ({
          ...prev,
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        }));
      });
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !propertySearch ||
        p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.city.toLowerCase().includes(propertySearch.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesType = selectedTypes.size === 0 || selectedTypes.has(p.type);
      return matchesSearch && matchesPrice && matchesType;
    });
  }, [propertySearch, priceRange, selectedTypes]);

  const activeFilterCount =
    (propertySearch ? 1 : 0) +
    (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX ? 1 : 0) +
    selectedTypes.size;

  const toggleType = (type: PropertyType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const clearFilters = () => {
    setPropertySearch("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSelectedTypes(new Set());
  };

  const handleRangeChange = (thumb: "min" | "max", val: number) => {
    setPriceRange((prev) => {
      if (thumb === "min") return [Math.min(val, prev[1] - 50), prev[1]];
      return [prev[0], Math.max(val, prev[0] + 50)];
    });
  };

  const filteredClients = existingClients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.country.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSelectExistingClient = (client: ExistingClientOption) => {
    setSelectedClient(client);
    setFormData({ ...formData, name: client.name, email: client.email, phone: client.phone, country: client.country });
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientSearch("");
    setFormData({ ...formData, name: "", email: "", phone: "", country: "" });
  };

  const handleSwitchMode = (mode: "existing" | "corporation") => {
    setClientMode(mode);
    setSelectedClient(null);
    setClientSearch("");
    setFormData({ ...formData, name: "", email: "", phone: "", country: "" });
  };

  const handleNext = () => { if (currentStep < 6) setCurrentStep(currentStep + 1); };
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async () => {
    setSubmitError(null);

    const customerIdForPayload = selectedClient?.id || pendingCustomerId || "";

    if (clientMode === "existing" && !customerIdForPayload) {
      setSubmitError("Please select an existing customer before publishing.");
      return;
    }

    if (!listingData.placeName.trim() || !listingData.propertyType.trim()) {
      setSubmitError("Property name and property type are required.");
      return;
    }

    if (!listingData.coverImageUrl) {
      setSubmitError("Please upload a cover image before publishing.");
      return;
    }

    setIsPublishing(true);

    try {
      const resolvedHostId = await resolveHostId();
      const availability: CreateListingRequest["booking_availability"] =
        listingData.availabilityType === "always" ? "Always" : "One Time";
      const commonAmenities = amenityGroups[0].items
        .filter((item) => selectedAmenities.has(item))
        .map((item) => tokenizeValue(item));
      const additionalFeatures = amenityGroups[1].items
        .filter((item) => selectedAmenities.has(item))
        .map((item) => tokenizeValue(item));
      const specialFeatures = amenityGroups[2].items
        .filter((item) => selectedAmenities.has(item))
        .map((item) => tokenizeValue(item));
      const safetySecurityFeatures = amenityGroups[3].items
        .filter((item) => selectedAmenities.has(item))
        .map((item) => tokenizeValue(item));

      const payload: CreateListingRequest = {
        corporate_host_id: resolvedHostId,
        corporate_host_customer_id: clientMode === "existing" ? customerIdForPayload : undefined,
        is_corporate_owner_of_property: clientMode === "corporation",
        property_type: listingData.propertyType.trim().toLowerCase(),
        property_name: listingData.placeName.trim(),
        city: listingData.city.trim(),
        state: listingData.state.trim(),
        postal_code: listingData.postalCode.trim(),
        room_no: listingData.roomNumber.trim(),
        address: listingData.street.trim(),
        longitude: String(listingData.longitude),
        latitude: String(listingData.latitude),
        area: Number(listingData.areaM2) || 0,
        guests: Number(listingData.guests) || 0,
        bedrooms: Number(listingData.bedrooms) || 0,
        bathrooms: Number(listingData.bathrooms) || 0,
        kitchen: Number(listingData.kitchen) || 0,
        beds: Number(listingData.beds) || 0,
        common_amenities: commonAmenities,
        special_features: specialFeatures,
        additional_features: additionalFeatures,
        safety_security_features: safetySecurityFeatures,
        house_rules: Array.from(selectedHouseRules).map((rule) => tokenizeValue(rule)),
        additional_house_rules: additionalRules.map((rule) => tokenizeValue(rule)),
        property_tags: tags.map((tag) => tokenizeValue(tag)),
        description: listingData.placeDescription.trim(),
        booking_availability: availability,
        start_date: availability === "One Time" ? listingData.availabilityStartDate || undefined : undefined,
        end_date: availability === "One Time" ? listingData.availabilityEndDate || undefined : undefined,
        cover_image: listingData.coverImageUrl,
        additional_images: listingData.imageUrls,
        monthly_price: Number(monthlyPrice) || 0,
        price_per_night: Number((monthlyPrice / 30).toFixed(2)),
        is_active: isEditMode ? editListingIsActive : true,
      };

      if (isEditMode && editListingId) {
        await updateListingById(editListingId, payload);
      } else {
        await createListing(payload);
      }

      navigate("/properties");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save listing right now.");
    } finally {
      setIsPublishing(false);
    }
  };

  const minPct = ((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
          {isEditMode ? "Edit Property Listing" : "New Property Listing"}
        </h1>
        <p className="text-[#666666]">
          {isEditMode
            ? "Update your listing using the same step-by-step flow"
            : "List a property on behalf of a client or corporation"}
        </p>
      </div>

      {isLoadingEditListing && (
        <div className="mb-6 rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 text-[#666666] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#00CFC5]" />
          Loading existing listing details...
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id ? "bg-[#00CFC5] border-[#00CFC5] text-white" : "bg-white border-black/20 text-[#999999]"}`}>
                  {currentStep > step.id ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                </div>
                <p className={`mt-2 text-sm ${currentStep >= step.id ? "text-[#0D0D0D]" : "text-[#999999]"}`}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-black/10">
                  <div className="h-full bg-[#00CFC5] transition-all duration-300" style={{ width: currentStep > step.id ? "100%" : "0%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm"
      >
        {/* Step 1: Client Type Selection */}
        {currentStep === 1 && (
          <Step1ClientType
            clientMode={clientMode}
            handleSwitchMode={handleSwitchMode}
            clientSearch={clientSearch}
            setClientSearch={setClientSearch}
            showClientDropdown={showClientDropdown}
            setShowClientDropdown={setShowClientDropdown}
            selectedClient={selectedClient}
            handleClearClient={handleClearClient}
            filteredClients={filteredClients}
            handleSelectExistingClient={handleSelectExistingClient}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {/* Step 2: Property Details */}
        {currentStep === 2 && (
          <Step2PropertyDetails
            listingData={listingData}
            setListingData={setListingData}
            googleMapRef={mapRef}
            mapsLoaded={mapsLoaded}
            initializeMap={initializeMap}
          />
        )}

        {/* Step 3: Listing Details */}
        {currentStep === 3 && (
          <Step3ListingDetails
            listingData={listingData}
            setListingData={setListingData}
            adjustListingCount={adjustListingCount}
          />
        )}

        {/* Step 4: Amenities & Rules */}
        {currentStep === 4 && (
          <Step4AmenitiesRules
            selectedAmenities={selectedAmenities}
            toggleAmenity={toggleAmenity}
            selectedHouseRules={selectedHouseRules}
            toggleHouseRule={toggleHouseRule}
            additionalRules={additionalRules}
            handleAddRule={handleAddRule}
            removeRule={(index) => setAdditionalRules((prev) => prev.filter((_, i) => i !== index))}
            tags={tags}
            handleAddTag={handleAddTag}
            removeTag={(index) => setTags((prev) => prev.filter((_, i) => i !== index))}
            newTag={newTag}
            setNewTag={setNewTag}
            newRule={newRule}
            setNewRule={setNewRule}
          />
        )}

        {/* Step 5: Media & Pricing */}
        {currentStep === 5 && (
          <Step5MediaPricing
            listingData={listingData}
            setListingData={setListingData}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            placeImages={placeImages}
            setPlaceImages={setPlaceImages}
            monthlyPrice={monthlyPrice}
            setMonthlyPrice={setMonthlyPrice}
            isUploadingCover={isUploadingCover}
            isUploadingPlaceImages={isUploadingPlaceImages}
            uploadError={uploadError}
            handleCoverImageChange={handleCoverImageChange}
            handleRemoveCoverImage={handleRemoveCoverImage}
            handlePlaceImagesChange={handlePlaceImagesChange}
            removePlaceImage={removePlaceImage}
          />
        )}

        {/* Step 6: Preview Property */}
        {currentStep === 6 && (
          <Step6PreviewProperty
            listingData={listingData}
            coverImage={coverImage}
            coverImageUrl={listingData.coverImageUrl}
            monthlyPrice={monthlyPrice}
          />
        )}
        {submitError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {submitError}
          </div>
        )}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/10">
          <button onClick={handlePrevious} disabled={currentStep === 1} className="px-6 py-3 border border-black/10 rounded-xl text-[#666666] hover:border-[#00CFC5]/40 hover:text-[#0D0D0D] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium">
            <ChevronLeft className="w-5 h-5" />Previous
          </button>
          {currentStep < 6 ? (
            <button onClick={handleNext} className="px-6 py-3 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all flex items-center gap-2 shadow-sm font-medium">
              Next<ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => void handleSubmit()}
              disabled={isPublishing || isLoadingEditListing}
              className="px-8 py-3 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all shadow-sm flex items-center gap-2 font-medium disabled:opacity-70"
            >
              <Check className="w-5 h-5" />
              {isEditMode ? "Save Changes" : "Publish Listing"}
            </button>
          )}
        </div>
      </motion.div>

      <RefundPolicyModal isOpen={showRefundPolicy} onClose={() => setShowRefundPolicy(false)} />
    </div>
  );
}