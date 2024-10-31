import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../../../../shared/services/envio.service';
import { RecojoService } from '../../../../shared/services/recojo.service';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { DetallePedidoService } from '../../../../shared/services/detalle-pedido.service';
import { ProductoService } from '../../../../shared/services/producto.service';
import { DetallePedidoBody } from '../../../../shared/models/detallePedido';
import { CarritoService } from '../../../../shared/services/carrito.service';
import { ComprobanteService } from '../../../../shared/services/comprobante.service';
import { jsPDF } from 'jspdf';

// Define la interfaz para los detalles del pedido
interface DetallePedido {
  cantidad: number;
  precioUnitario: number;
  precioDescuento: number;
  subtotal: number;
  idProducto: number;
  idPedido: number;
  nombreProducto: string; // Agrega el nombre del producto
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  carritoIds: string[] = [];
  cantidades: { [key: string]: number } = {};
  detallePedidos: DetallePedido[] = []; // Cambia aquí para usar la interfaz

  constructor(
    private envioService: EnvioService,
    private recojoService: RecojoService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private detallePedidoService: DetallePedidoService,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private comprobanteService: ComprobanteService
  ) {}

  ngOnInit(): void {
    this.carritoIds = this.carritoService.getCarritoIds();
    this.cargarCantidadesDesdeStorage();
  }

  cargarCantidadesDesdeStorage(): void {
    const cantidadesGuardadas = localStorage.getItem('cantidades');
    if (cantidadesGuardadas) {
      this.cantidades = JSON.parse(cantidadesGuardadas);
    }
  }

  continue(): void {
    const selectedDepartamento = localStorage.getItem('selectedDepartamento');
    const selectedProvincia = localStorage.getItem('selectedProvincia');
    const selectedDistrito = localStorage.getItem('selectedDistrito');
    const referencia = localStorage.getItem('referencia');
    const CodigoPostal = localStorage.getItem('CodigoPostal');
    const total = parseFloat(localStorage.getItem('totalCarrito') || '0');

    const rucData = localStorage.getItem('rucData') ? JSON.parse(localStorage.getItem('rucData')!) : null;
    const dniData = localStorage.getItem('dniData') ? JSON.parse(localStorage.getItem('dniData')!) : null;

    const razonSocial = localStorage.getItem('switchState') === 'true' ? rucData?.razonSocial : `${dniData?.nombres} ${dniData?.apellidoPaterno} ${dniData?.apellidoMaterno}`;
    const email = localStorage.getItem('switchState') === 'true' ? localStorage.getItem('gmailFactura') : localStorage.getItem('gmailBoleta');
    const telefonoMovil = localStorage.getItem('switchState') === 'true' ? localStorage.getItem('celularFactura') : localStorage.getItem('celularBoleta');
    const tipoDocumento = localStorage.getItem('switchState') === 'true' ? 'RUC' : 'DNI';
    const numeroDocumento = localStorage.getItem('switchState') === 'true' ? rucData?.ruc : dniData?.dni;
    const direccionFiscal = localStorage.getItem('switchState') === 'true' ? rucData?.direccion : '';

    let envioData = null;
    let recojoData = null;

    if (selectedDepartamento && selectedProvincia && selectedDistrito && referencia && CodigoPostal) {
      const [calle, numeroDomicilio] = referencia.split('N°').map(part => part.trim());
      const localidad = `${selectedDepartamento} ${selectedProvincia} ${selectedDistrito}`;

      envioData = {
        region: selectedDepartamento,
        provincia: selectedProvincia,
        distrito: selectedDistrito,
        localidad: localidad,
        calle: calle,
        nDomicilio: numeroDomicilio,
        codigoPostal: CodigoPostal,
        fechaEnvio: null,
        fechaEntrega: null,
        responsableEntrega: null,
        idPersonal: 1
      };
    } else {
      recojoData = {
        fechaListo: null,
        fechaEntrega: null,
        responsableDeRecojo: null,
      };
    }

    const clienteData = {
      razonSocial: razonSocial,
      email: email,
      telefonoMovil: telefonoMovil,
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento,
      direccionFiscal: direccionFiscal
    };

    if (envioData) {
      this.envioService.create(envioData).subscribe((envio: any) => {
        const envioId = envio?.idEnvio || envio?.data?.idEnvio;
        if (envioId != null) {
          localStorage.setItem('envioId', envioId.toString());
          this.savePedido(envioId, null, clienteData, total);
        } else {
          console.error('Error: Envio no contiene un id.', envio);
        }
      });
    } else if (recojoData) {
      this.recojoService.create(recojoData).subscribe((recojo: any) => {
        const recojoId = recojo?.idRecojo;
        if (recojoId != null) {
          localStorage.setItem('recojoId', recojoId.toString());
          this.savePedido(null, recojoId, clienteData, total);
        } else {
          console.error('Error: Recojo no contiene un id.', recojo);
        }
      });
    }
  }

  savePedido(envioId: number | null, recojoId: number | null, clienteData: any, total: number): void {
    this.clienteService.create(clienteData).subscribe((cliente: any) => {
      const clienteId = cliente?.idCliente || cliente?.id;
      if (clienteId != null) {
        localStorage.setItem('clienteId', clienteId.toString());

        const pedidoData = {
          fechaPedido: new Date(),
          fechaCancelado: null,
          tipoPedido: envioId ? 'Envio a Domicilio' : 'Recojo en Tienda',
          estado: 'Pendiente',
          total: total,
          idCliente: clienteId,
          idPersonal: 1,
          idEnvio: envioId,
          idRecojo: recojoId
        };

        this.pedidoService.create(pedidoData).subscribe((pedido: any) => {
          const pedidoId = pedido?.idPedido || pedido?.id;
          if (pedidoId != null) {
            localStorage.setItem('pedidoId', pedidoId.toString());
            this.saveDetallePedido(pedidoId).then(() => {
              this.createComprobante(clienteData, pedidoId, total); // Pasa el total aquí
            });
          } else {
            console.error('Error: Pedido no contiene un id.', pedido);
          }
        });
      } else {
        console.error('Error: Cliente no contiene un id.', cliente);
      }
    });
  }

  saveDetallePedido(pedidoId: number): Promise<void> {
    if (this.carritoIds.length === 0) {
      console.error('No hay productos en el carrito.');
      return Promise.reject('No hay productos en el carrito.');
    }

    const detalles: DetallePedido[] = [];

    const observables = this.carritoIds.map(id => {
      const cantidad = this.cantidades[id];
      return this.productoService.getById(Number(id)).toPromise().then((producto: any) => {
        const precioUnitario = producto?.precio;
        const precioDescuento = producto?.precioOferta || 0;
        const subtotal = precioDescuento > 0 ? precioDescuento * cantidad : precioUnitario * cantidad;

        const detallePedidoData: DetallePedidoBody = {
          cantidad: cantidad,
          precioUnitario: precioUnitario,
          precioDescuento: precioDescuento,
          subtotal: subtotal,
          idProducto: Number(id),
          idPedido: pedidoId
        };

        detalles.push({ 
          ...detallePedidoData, 
          nombreProducto: producto?.productoNombre, 
          precioDescuento: precioDescuento !== null ? precioDescuento : 0 
        });

        return this.detallePedidoService.create(detallePedidoData).toPromise();
      });
    });

    return Promise.all(observables).then(() => {
      this.detallePedidos = detalles; 
      console.log('Detalles de pedido guardados:', detalles);
    }).catch(err => {
      console.error('Error al guardar los detalles del pedido:', err);
      throw err; // Propagar el error
    });
  }

  createComprobante(clienteData: any, pedidoId: number, total: number): void {
    const tipoDocumento = localStorage.getItem('switchState') === 'true' ? 'RUC' : 'DNI';
    const tipoComprobante = tipoDocumento === 'RUC' ? 'Factura' : 'Boleta';
    const fechaEmision = new Date();

    const comprobanteData = {
      tipoComprobante: tipoComprobante,
      fechaEmision: fechaEmision,
      idPedido: Number(pedidoId)
    };

    this.comprobanteService.create(comprobanteData).subscribe({
      next: (res) => {
        console.log('Comprobante creado:', res);
        this.generatePDF(comprobanteData, clienteData, pedidoId, total); // Pasa el total aquí
      },
      error: (err) => {
        console.error('Error al crear el comprobante:', err);
      }
    });
  }

  generatePDF(comprobanteData: any, clienteData: any, pedidoId: number, total: number): void {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Comprobante', 20, 20);

    doc.setFontSize(12);
    doc.text(`Tipo de Comprobante: ${comprobanteData.tipoComprobante}`, 20, 30);
    doc.text(`Fecha de Emisión: ${comprobanteData.fechaEmision.toLocaleDateString()}`, 20, 40);
    doc.text(`ID de Pedido: ${pedidoId}`, 20, 50);
    
    doc.text('Datos del Cliente:', 20, 60);
    doc.text(`Razón Social: ${clienteData.razonSocial}`, 20, 70);
    doc.text(`Email: ${clienteData.email}`, 20, 80);
    doc.text(`Teléfono: ${clienteData.telefonoMovil}`, 20, 90);
    doc.text(`Tipo Documento: ${clienteData.tipoDocumento}`, 20, 100);
    doc.text(`Número Documento: ${clienteData.numeroDocumento}`, 20, 110);

    // Agregar detalles del pedido al PDF
    doc.text('Detalles del Pedido:', 20, 120);
    let offset = 130; 
    this.detallePedidos.forEach(detalle => {
      doc.text(`Producto: ${detalle.nombreProducto}`, 20, offset);
      doc.text(`Cantidad: ${detalle.cantidad}`, 20, offset + 10);
      doc.text(`Precio Unitario: ${detalle.precioUnitario}`, 20, offset + 20);
      doc.text(`Precio Descuento: ${detalle.precioDescuento}`, 20, offset + 30);
      doc.text(`Subtotal: ${detalle.subtotal}`, 20, offset + 40);
      offset += 50; 
    });

    // Agregar el total del pedido
    doc.text(`Total: ${total}`, 20, offset);

    // Guardar el documento PDF
    doc.save(`comprobante_${comprobanteData.tipoComprobante.toLowerCase()}_${pedidoId}.pdf`);

    // Limpiar el local storage
    localStorage.clear();
  }
}
