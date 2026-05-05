import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Lato-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Lato-Black.ttf", fontWeight: 900 },
  ],
});

const C = {
  primario: "#5271ff",
  secundario: "#3147cc",
  texto: "#1f2937",
  fondo: "#f4f5fa",
  borde: "#b8c4d4",
  gris: "#5e6a78",
  grisClaro: "#6b7a92",
  blanco: "#ffffff",
  verde: "#3ba054",
  naranja: "#ed6b53",
};

function clean(s: string): string {
  if (!s) return "";
  return s
    .replace(
      /[\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2032\u2033\u2035\u2036]/g,
      "",
    )
    .trim();
}

const S = StyleSheet.create({
  page: { padding: 40, backgroundColor: C.fondo, fontFamily: "Lato" },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: 2,
    borderBottomColor: C.primario,
  },
  logo: { width: 130 },
  locLabel: {
    fontSize: 7,
    color: C.grisClaro,
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: 1,
    textAlign: "right",
  },
  locValue: {
    fontSize: 18,
    fontWeight: 900,
    color: C.secundario,
    marginTop: 2,
    textAlign: "right",
  },
  locFecha: {
    fontSize: 7,
    color: C.grisClaro,
    marginTop: 3,
    textAlign: "right",
  },
  // Section title
  secTitle: {
    fontSize: 8,
    fontWeight: 900,
    color: C.primario,
    marginTop: 18,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    paddingBottom: 4,
    borderBottom: 1,
    borderBottomColor: C.borde,
  },
  // Vuelo card
  vueloCard: {
    backgroundColor: C.blanco,
    borderRadius: 7,
    padding: 11,
    marginBottom: 7,
    border: 1,
    borderColor: C.borde,
  },
  vueloCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgeBox: {
    backgroundColor: "#e8ecff",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 7,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 7,
    fontWeight: 900,
    color: C.primario,
    textTransform: "uppercase",
  },
  codVuelo: { fontSize: 7, color: C.grisClaro },
  vueloTrayecto: {
    fontSize: 12,
    fontWeight: 900,
    color: C.texto,
    marginTop: 5,
  },
  vueloHorario: { fontSize: 7, color: C.grisClaro, marginTop: 2 },
  vueloFecha: { fontSize: 7, color: C.grisClaro, marginTop: 1 },
  vueloPrecio: { fontSize: 11, fontWeight: 900, color: C.primario },
  // Tabla servicios
  tHeader: {
    flexDirection: "row",
    backgroundColor: C.secundario,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tHeaderTxt: {
    fontSize: 7,
    fontWeight: 900,
    color: C.blanco,
    textTransform: "uppercase",
  },
  tRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: 1,
    borderBottomColor: "#e8ecff",
    alignItems: "center",
    // wrap false para no partir filas entre páginas
  },
  tRowAlt: { backgroundColor: "#f4f6ff" },
  tRowGreen: { backgroundColor: "#f0fff4" },
  tTxt: { fontSize: 8, color: C.texto },
  tSub: { fontSize: 7, color: C.grisClaro, marginTop: 1 },
  tRight: {
    fontSize: 8,
    fontWeight: 900,
    color: C.secundario,
    textAlign: "right",
  },
  tGreen: { fontSize: 8, fontWeight: 900, color: C.verde, textAlign: "right" },
  // Nota explicativa
  notaBox: {
    backgroundColor: C.blanco,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 9,
    marginBottom: 6,
    border: 1,
    borderColor: C.borde,
  },
  notaLabel: {
    fontSize: 7,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  notaText: {
    fontSize: 7,
    color: C.grisClaro,
    lineHeight: 1.5,
  },
  // Subtotales
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottom: 1,
    borderBottomColor: "#e8ecff",
  },
  subLabel: { fontSize: 8, color: C.grisClaro },
  subVal: { fontSize: 8, fontWeight: 700, color: C.texto },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: "#e8ecff",
    borderRadius: 4,
    marginTop: 3,
  },
  totalRowLabel: { fontSize: 9, fontWeight: 900, color: C.secundario },
  totalRowVal: { fontSize: 9, fontWeight: 900, color: C.secundario },
  // Pasajeros — tabla con 4 columnas
  paxHeader: {
    flexDirection: "row",
    backgroundColor: "#e8ecff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  paxHeaderTxt: {
    fontSize: 7,
    fontWeight: 900,
    color: C.primario,
    textTransform: "uppercase",
  },
  paxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: 1,
    borderBottomColor: "#e8ecff",
  },
  paxNum: { fontSize: 9, fontWeight: 900, color: C.primario, width: 16 },
  paxNombre: { fontSize: 9, fontWeight: 900, color: C.texto, flex: 2.2 },
  paxDoc: { fontSize: 8, color: C.grisClaro, flex: 1.8 },
  paxNac: { fontSize: 8, color: C.grisClaro, flex: 1.5 },
  paxTipo: {
    fontSize: 7,
    fontWeight: 700,
    color: C.primario,
    flex: 0.8,
    textAlign: "right",
  },
  // Total box
  totalBox: {
    marginTop: 16,
    backgroundColor: C.secundario,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalBoxLabel: {
    color: C.blanco,
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  totalBoxMet: { color: "#a0b0f0", fontSize: 7, marginTop: 2 },
  totalBoxVal: { color: C.blanco, fontSize: 22, fontWeight: 900 },
  // Footer
  footer: {
    textAlign: "center",
    fontSize: 7,
    color: C.grisClaro,
    marginTop: 12,
    letterSpacing: 0.5,
  },
});

interface FilaServicio {
  concepto: string;
  detalle: string;
  precioU: number;
  cantidad: number;
  subtotal: number;
  esGratis: boolean;
}

export const ResumenReservaPDF = ({ datos }: { datos: any }) => {
  if (!datos?.vuelos || !datos?.pasajeros || !datos?.pago) {
    return (
      <Document>
        <Page style={S.page}>
          <View>
            <Text>Cargando datos...</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const nPax = datos.nPasajeros ?? datos.pasajeros.length;
  const serviciosIncluidos = datos.serviciosIncluidos || [];
  const extrasAdicionales = datos.extras || [];

  const tieneIda = datos.vuelos.some((v: any) => v.tipo === "ida");
  const tieneVuelta = datos.vuelos.some((v: any) => v.tipo === "vuelta");

  const textoServiciosIncluidos = (() => {
    if (tieneIda && tieneVuelta)
      return `Cada pasajero dispone de estos servicios en ambos tramos del viaje (ida y vuelta).`;
    if (tieneIda)
      return `Cada pasajero dispone de estos servicios en el vuelo de ida.`;
    return `Cada pasajero dispone de estos servicios en el vuelo de vuelta.`;
  })();

  const textoExtras =
    `Los extras se contratan como unidades totales para el grupo, no por pasajero. ` +
    `Podéis organizaros libremente entre vosotros.`;

  const subtotalVuelos =
    datos.subtotalVuelos ??
    datos.vuelos.reduce(
      (a: number, v: any) => a + Number(v.precio || 0) * nPax,
      0,
    );

  const subtotalExtras =
    datos.subtotalExtras ??
    extrasAdicionales.reduce((a: number, e: any) => {
      const s =
        typeof e.subtotal === "string"
          ? parseFloat(e.subtotal)
          : Number(e.subtotal || 0);
      return a + s;
    }, 0);

  // Filas de la tabla de servicios
  const rowsIncluidos = serviciosIncluidos.map((s: any) => ({
    concepto: s.nombre,
    detalle:
      s.cantidad_incluida > 0
        ? `x${s.cantidad_incluida} por pasajero`
        : "Incluido en tarifa",
    precioU: 0,
    cantidad: nPax,
    subtotal: 0,
    esGratis: true,
  }));

  const rowsVuelos = datos.vuelos.map((v: any) => ({
    concepto: v.tipo === "ida" ? "Vuelo de salida" : "Vuelo de regreso",
    detalle: clean(v.trayectoIda || v.trayectoVuelta || ""),
    precioU: Number(v.precio || 0),
    cantidad: nPax,
    subtotal: Number(v.precio || 0) * nPax,
    esGratis: false,
  }));

  const rowsExtras = extrasAdicionales.map((e: any) => {
    const pu =
      typeof e.precioUnitario === "string"
        ? parseFloat(e.precioUnitario)
        : Number(e.precio_extra || e.precioUnitario || 0);
    const qty = Number(e.cantidad || 1);
    const sub =
      typeof e.subtotal === "string"
        ? parseFloat(e.subtotal)
        : Number(e.subtotal || pu * qty);
    return {
      concepto: e.nombre,
      detalle:
        e.tipo_vuelo && e.tipo_vuelo !== "ambos"
          ? e.tipo_vuelo === "ida"
            ? "Solo vuelo de ida"
            : "Solo vuelo de vuelta"
          : "",
      precioU: pu,
      cantidad: qty,
      subtotal: sub,
      esGratis: false,
    };
  });

  return (
    <Document title={`Reserva Horizonte Azul - ${datos.id}`}>
      <Page size="A4" style={S.page}>
        {/* HEADER */}
        <View style={S.header}>
          <Image src="/media/img/logo_empresa_header.png" style={S.logo} />
          <View>
            <Text style={S.locLabel}>Localizador de reserva</Text>
            <Text style={S.locValue}>#{datos.id}</Text>
            <Text style={S.locFecha}>{datos.fechaCompra}</Text>
          </View>
        </View>

        {/* ITINERARIO */}
        <Text style={S.secTitle}>Itinerario de vuelo</Text>
        <View wrap={false}>
          {datos.vuelos.map((v: any, i: number) => (
            <View key={i} style={S.vueloCard}>
              <View style={S.vueloCardRow}>
                <View style={S.badgeBox}>
                  <Text style={S.badgeText}>
                    {v.tipo === "ida" ? "Vuelo de salida" : "Vuelo de regreso"}
                  </Text>
                </View>
                <Text style={S.codVuelo}>{v.codigo_vuelo}</Text>
              </View>
              <View
                style={[
                  S.vueloCardRow,
                  { marginTop: 8, alignItems: "flex-end" },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={S.vueloTrayecto}>
                    {clean(
                      v.tipo === "ida"
                        ? v.trayectoIda || ""
                        : v.trayectoVuelta || "",
                    )}
                  </Text>
                  <Text style={S.vueloHorario}>
                    {v.fecha_salida ? (
                      <Text style={S.vueloFecha}>
                        Fecha del vuelo: {v.fecha_salida}
                      </Text>
                    ) : null}
                    <Text style={S.vueloFecha}>
                      Horario aproximado: {v.hora_salida} - {v.hora_llegada}
                    </Text>
                  </Text>
                </View>
                <Text style={S.vueloPrecio}>
                  Precio Base: {Number(v.precio || 0).toFixed(2)}€
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* DESGLOSE — vuelos */}
        <Text style={S.secTitle}>Desglose de servicios</Text>

        {/* Nota servicios incluidos */}
        {rowsIncluidos.length > 0 && (
          <View style={[S.notaBox, { borderColor: C.verde }]} wrap={false}>
            <Text style={[S.notaLabel, { color: C.verde }]}>
              ✓ Incluidos en la tarifa
            </Text>
            <Text style={S.notaText}>{textoServiciosIncluidos}</Text>
          </View>
        )}

        {/* Nota extras */}
        {rowsExtras.length > 0 && (
          <View style={[S.notaBox, { borderColor: C.naranja }]} wrap={false}>
            <Text style={[S.notaLabel, { color: C.naranja }]}>
              + Extras contratados
            </Text>
            <Text style={S.notaText}>{textoExtras}</Text>
          </View>
        )}

        {/* Cabecera tabla */}
        <View style={S.tHeader} wrap={false}>
          <Text style={[S.tHeaderTxt, { flex: 2.5 }]}>Concepto</Text>
          <Text style={[S.tHeaderTxt, { flex: 1, textAlign: "center" }]}>
            Precio u.
          </Text>
          <Text style={[S.tHeaderTxt, { flex: 0.5, textAlign: "center" }]}>
            Cant.
          </Text>
          <Text style={[S.tHeaderTxt, { flex: 1, textAlign: "right" }]}>
            Subtotal
          </Text>
        </View>

        {/* Filas vuelos */}
        {rowsVuelos.map((row: FilaServicio, idx: number) => (
          <View
            key={`v-${idx}`}
            style={[S.tRow, idx % 2 === 0 ? S.tRowAlt : {}]}
            wrap={false}
          >
            <View style={{ flex: 2.5 }}>
              <Text style={S.tTxt}>{row.concepto}</Text>
              {row.detalle ? <Text style={S.tSub}>{row.detalle}</Text> : null}
            </View>
            <Text style={[S.tTxt, { flex: 1, textAlign: "center" }]}>
              {row.precioU.toFixed(2)}€
            </Text>
            <Text style={[S.tTxt, { flex: 0.5, textAlign: "center" }]}>
              {row.cantidad}
            </Text>
            <Text style={[S.tRight, { flex: 1 }]}>
              {row.subtotal.toFixed(2)}€
            </Text>
          </View>
        ))}

        {/* Filas incluidos */}
        {rowsIncluidos.map((row: FilaServicio, idx: number) => (
          <View key={`i-${idx}`} style={[S.tRow, S.tRowGreen]} wrap={false}>
            <View style={{ flex: 2.5 }}>
              <Text style={[S.tTxt, { color: C.verde }]}>{row.concepto}</Text>
              {row.detalle ? <Text style={S.tSub}>{row.detalle}</Text> : null}
            </View>
            <Text
              style={[
                S.tTxt,
                { flex: 1, textAlign: "center", color: C.grisClaro },
              ]}
            >
              0.00€
            </Text>
            <Text style={[S.tTxt, { flex: 0.5, textAlign: "center" }]}>
              {row.cantidad}
            </Text>
            <Text style={[S.tGreen, { flex: 1 }]}>GRATIS</Text>
          </View>
        ))}

        {/* Filas extras */}
        {rowsExtras.map((row: FilaServicio, idx: number) => (
          <View
            key={`e-${idx}`}
            style={[
              S.tRow,
              (rowsVuelos.length + rowsIncluidos.length + idx) % 2 === 0
                ? S.tRowAlt
                : {},
            ]}
            wrap={false}
          >
            <View style={{ flex: 2.5 }}>
              <Text style={S.tTxt}>{row.concepto}</Text>
              {row.detalle ? <Text style={S.tSub}>{row.detalle}</Text> : null}
            </View>
            <Text style={[S.tTxt, { flex: 1, textAlign: "center" }]}>
              {row.precioU.toFixed(2)}€
            </Text>
            <Text style={[S.tTxt, { flex: 0.5, textAlign: "center" }]}>
              {row.cantidad}
            </Text>
            <Text style={[S.tRight, { flex: 1 }]}>
              {row.subtotal.toFixed(2)}€
            </Text>
          </View>
        ))}

        {/* SUBTOTALES */}
        <View style={{ marginTop: 6 }} wrap={false}>
          <View style={S.subRow}>
            <Text style={S.subLabel}>Subtotal vuelos ({nPax} pax)</Text>
            <Text style={S.subVal}>{subtotalVuelos.toFixed(2)}€</Text>
          </View>
          {subtotalExtras > 0 && (
            <View style={S.subRow}>
              <Text style={S.subLabel}>Subtotal extras</Text>
              <Text style={S.subVal}>{subtotalExtras.toFixed(2)}€</Text>
            </View>
          )}
          <View style={S.totalRow}>
            <Text style={S.totalRowLabel}>TOTAL</Text>
            <Text style={S.totalRowVal}>
              {Number(datos.pago?.total || 0).toFixed(2)}€
            </Text>
          </View>
        </View>

        {/* PASAJEROS */}
        <Text style={S.secTitle}>Pasajeros registrados</Text>
        <View wrap={false}>
          <View style={S.paxHeader}>
            <Text style={[S.paxHeaderTxt, { width: 16 }]}>#</Text>
            <Text style={[S.paxHeaderTxt, { flex: 2.2 }]}>Nombre completo</Text>
            <Text style={[S.paxHeaderTxt, { flex: 1.8 }]}>Documento</Text>
            <Text style={[S.paxHeaderTxt, { flex: 1.5 }]}>F. nacimiento</Text>
            <Text style={[S.paxHeaderTxt, { flex: 0.8, textAlign: "right" }]}>
              Tipo
            </Text>
          </View>
          {datos.pasajeros.map((p: any, i: number) => (
            <View
              key={i}
              style={[S.paxRow, i % 2 === 0 ? S.tRowAlt : {}]}
              wrap={false}
            >
              <Text style={S.paxNum}>{i + 1}</Text>
              <Text style={S.paxNombre}>
                {(p.nombreCompleto || "").toUpperCase()}
              </Text>
              <Text style={S.paxDoc}>{p.documento || "—"}</Text>
              <Text style={S.paxNac}>{p.fecNacimiento || "—"}</Text>
              <Text style={S.paxTipo}>{p.tipo}</Text>
            </View>
          ))}
        </View>

        {/* TOTAL BOX */}
        <View style={S.totalBox} wrap={false}>
          <View>
            <Text style={S.totalBoxLabel}>Total pagado</Text>
            <Text style={S.totalBoxMet}>
              {datos.pago?.metodo}
              {datos.pago?.last4 && datos.pago.last4 !== "****"
                ? ` (**** ${datos.pago.last4})`
                : ""}
            </Text>
          </View>
          <Text style={S.totalBoxVal}>
            {Number(datos.pago?.total || 0).toFixed(2)}€
          </Text>
        </View>

        <Text style={S.footer}>
          Horizonte Azul · Gracias por confiar en nosotros · horizonteazul.com
        </Text>
      </Page>
    </Document>
  );
};
