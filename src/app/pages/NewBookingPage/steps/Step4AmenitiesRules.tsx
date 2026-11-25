import { Plus, X } from "lucide-react";
import { motion } from "motion/react";

interface Step4Props {
  selectedAmenities: Set<string>;
  toggleAmenity: (amenity: string) => void;
  selectedHouseRules: Set<string>;
  toggleHouseRule: (rule: string) => void;
  additionalRules: string[];
  handleAddRule: () => void;
  removeRule: (index: number) => void;
  tags: string[];
  handleAddTag: () => void;
  removeTag: (index: number) => void;
  newTag: string;
  setNewTag: (value: string) => void;
  newRule: string;
  setNewRule: (value: string) => void;
}

const amenityGroups = {
  Common: ["WiFi", "TV", "Air Conditioning", "Heating", "Washer", "Dryer"],
  "Additional Features": ["Pool", "Gym", "Hot Tub", "Sauna", "Parking", "Elevator"],
  "Special Features": ["Beach Access", "Mountain View", "City View", "Garden", "Balcony", "Patio"],
  "Safety & Security": ["Smoke Detector", "Fire Extinguisher", "First Aid Kit", "Security Camera", "Safe"],
};

const houseRules = [
  "No Smoking",
  "No Parties",
  "No Pets",
  "No Loud Music",
  "Quiet Hours After 10 PM",
  "No Guests After 11 PM",
];

export function Step4AmenitiesRules({
  selectedAmenities,
  toggleAmenity,
  selectedHouseRules,
  toggleHouseRule,
  additionalRules,
  handleAddRule,
  removeRule,
  tags,
  handleAddTag,
  removeTag,
  newTag,
  setNewTag,
  newRule,
  setNewRule,
}: Step4Props) {
  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Amenities & Rules</h2>

      {/* Amenities Section */}
      <div className="mb-8">
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">Available Amenities</h3>
        <div className="space-y-6">
          {Object.entries(amenityGroups).map(([group, items]) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white border border-black/10 rounded-xl"
            >
              <h4 className="text-sm font-medium text-[#666666] mb-3">{group}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.has(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-5 h-5 bg-white border border-black/10 rounded accent-[#00CFC5] cursor-pointer"
                    />
                    <span className="text-[#0D0D0D] group-hover:text-[#00CFC5] transition-colors">{amenity}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* House Rules Section */}
      <div className="mb-8">
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">House Rules</h3>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 bg-white border border-black/10 rounded-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {houseRules.map((rule) => (
              <label key={rule} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedHouseRules.has(rule)}
                  onChange={() => toggleHouseRule(rule)}
                  className="w-5 h-5 bg-white border border-black/10 rounded accent-[#00CFC5] cursor-pointer"
                />
                <span className="text-[#0D0D0D] group-hover:text-[#00CFC5] transition-colors">{rule}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Rules Section */}
      <div className="mb-8">
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">Additional Rules</h3>
        <div className="space-y-3 mb-4">
          {additionalRules.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {additionalRules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-lg border border-black/5"
                >
                  <span className="text-[#0D0D0D]">{rule}</span>
                  <button
                    onClick={() => removeRule(index)}
                    className="text-[#999999] hover:text-[#E74C3C] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddRule();
                e.preventDefault();
              }
            }}
            className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="Add a custom rule..."
          />
          <button
            onClick={handleAddRule}
            className="px-6 py-3 bg-[#00CFC5]/10 hover:bg-[#00CFC5]/20 text-[#00CFC5] rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">Property Tags</h3>
        <div className="flex flex-wrap gap-2 mb-4 min-h-8">
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 w-full"
            >
              {tags.map((tag, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00CFC5]/15 border border-[#00CFC5]/30 rounded-full"
                >
                  <span className="text-[#0D0D0D] text-sm font-medium">{tag}</span>
                  <button
                    onClick={() => removeTag(index)}
                    className="text-[#00CFC5] hover:text-[#E74C3C] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
                e.preventDefault();
              }
            }}
            className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="Add tags like 'Pet Friendly', 'Family Friendly', etc..."
          />
          <button
            onClick={handleAddTag}
            className="px-6 py-3 bg-[#00CFC5]/10 hover:bg-[#00CFC5]/20 text-[#00CFC5] rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
