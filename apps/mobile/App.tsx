import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  ZONES,
  buildOrderMessage,
  whatsappLink,
  type OrderDraft,
} from "@absher/shared";

const C = { yellow: "#FFDB34", ink: "#1C1706", paper: "#FFFCF1", line: "#EADFB8", muted: "#6B6248", wa: "#1F9D55" };

const EMPTY: OrderDraft = {
  category: "restaurant",
  details: "",
  pickup: "",
  zone: ZONES[0],
  address: "",
  customerName: "",
  phone: "",
  payment: "cash",
};

function Chips<T extends string>(props: { items: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={s.chips}>
      {props.items.map((it) => {
        const on = it.key === props.value;
        return (
          <Pressable key={it.key} onPress={() => props.onChange(it.key)} style={[s.chip, on && s.chipOn]}>
            <Text style={[s.chipText, on && { color: C.ink }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; phone?: boolean }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{props.label}</Text>
      <TextInput
        style={[s.input, props.multiline && { minHeight: 90, textAlignVertical: "top" }]}
        value={props.value}
        onChangeText={props.onChange}
        placeholder={props.placeholder}
        placeholderTextColor="#A89D7C"
        multiline={props.multiline}
        keyboardType={props.phone ? "phone-pad" : "default"}
      />
    </View>
  );
}

export default function App() {
  const [order, setOrder] = useState<OrderDraft>(EMPTY);
  const [zonesOpen, setZonesOpen] = useState(false);
  const message = useMemo(() => buildOrderMessage(order), [order]);
  const set = <K extends keyof OrderDraft>(k: K, v: OrderDraft[K]) => setOrder((o) => ({ ...o, [k]: v }));

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={s.hero}>
          <Image source={require("./assets/logo.jpg")} style={s.logo} />
          <Text style={s.h1}>بدك إشي بمادبا؟</Text>
          <Text style={s.lead}>قول ابشر، وبوصلك لباب البيت.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.h2}>اطلب أي إشي</Text>
          <Chips items={CATEGORIES} value={order.category} onChange={(v) => set("category", v)} />
          <Field label="شو بدك؟" value={order.details} onChange={(v) => set("details", v)} placeholder="2 شاورما عربي + 1 بطاطا كبيرة" multiline />
          <Field label="من وين؟" value={order.pickup} onChange={(v) => set("pickup", v)} placeholder="أي مطعم شاورما قريب" />

          <View style={{ gap: 4 }}>
            <Text style={s.label}>المنطقة</Text>
            <Pressable style={s.input} onPress={() => setZonesOpen((x) => !x)}>
              <Text style={{ color: C.ink }}>{order.zone}</Text>
            </Pressable>
            {zonesOpen && (
              <Chips
                items={ZONES.map((z) => ({ key: z, label: z }))}
                value={order.zone}
                onChange={(v) => {
                  set("zone", v);
                  setZonesOpen(false);
                }}
              />
            )}
          </View>

          <Field label="العنوان بالتفصيل" value={order.address} onChange={(v) => set("address", v)} placeholder="قرب دوار ...، عمارة ..." />
          <Field label="الاسم" value={order.customerName} onChange={(v) => set("customerName", v)} />
          <Field label="رقم الموبايل" value={order.phone} onChange={(v) => set("phone", v)} placeholder="079xxxxxxx" phone />
          <Text style={s.label}>الدفع</Text>
          <Chips items={PAYMENT_METHODS} value={order.payment} onChange={(v) => set("payment", v)} />

          <View style={s.receipt}>
            <Text style={{ color: C.ink, lineHeight: 24 }}>{message}</Text>
          </View>
          <Pressable style={s.send} onPress={() => Linking.openURL(whatsappLink(message))}>
            <Text style={s.sendText}>ابعت على واتساب</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: C.yellow, paddingTop: 64, paddingBottom: 48, paddingHorizontal: 20, alignItems: "flex-start" },
  logo: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
  h1: { fontSize: 34, fontWeight: "800", color: C.ink },
  lead: { fontSize: 18, color: C.ink, marginTop: 4 },
  card: { backgroundColor: "#fff", margin: 16, marginTop: -24, borderRadius: 20, borderWidth: 2, borderColor: C.line, padding: 16, gap: 12 },
  h2: { fontSize: 24, fontWeight: "800", color: C.ink },
  label: { fontSize: 14, color: C.muted, fontWeight: "600" },
  input: { borderWidth: 2, borderColor: C.line, borderRadius: 12, padding: 10, backgroundColor: C.paper, color: C.ink, fontSize: 16, textAlign: "right" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 2, borderColor: C.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: C.paper },
  chipOn: { backgroundColor: C.yellow, borderColor: C.yellow },
  chipText: { color: C.ink, fontSize: 14 },
  receipt: { borderWidth: 2, borderStyle: "dashed", borderColor: C.line, borderRadius: 14, padding: 12, backgroundColor: C.paper },
  send: { backgroundColor: C.wa, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  sendText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
