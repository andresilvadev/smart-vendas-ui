import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { VendasService } from '../vendas/vendas.service';

@Component({
  selector: 'app-venda-cadastro',
  templateUrl: './venda-cadastro.component.html',
  styleUrls: ['./venda-cadastro.component.css']
})
export class VendaCadastroComponent implements OnInit {

  venda: any;
  item: any;
  clientes: Array<any>;
  produtos: Array<any>;

  // Cria evento para atualizar a lista abaixo do componente de criação de venda
  @Output() vendaSalva = new EventEmitter();

  constructor(private vendasService: VendasService, private messageService: MessageService) { }

  ngOnInit() {
    this.vendasService.listarClientes()
      .subscribe(response => this.clientes = response);

    this.vendasService.listarProdutos()
      .subscribe(response => this.produtos = response);

    this.novaVenda();
  }

  novaVenda() {
    this.venda = { itens: [], frete: 0.0, total: 0.0, subtotal: 0.0 };
    this.item = {};
  }

  incluirItem() {
    // Cácula o valor da quantidade
    this.item.total = this.item.produto.valor * this.item.quantidade;

    // Adiciona item no array de itens
    this.venda.itens.push(this.item);

    // Inicializa o item novamente
    this.item = {};

    this.calcularTotal();
    this.calcularSubTotal();
  }

  excluirItem(item) {    
    var index: number = this.venda.itens.indexOf(item);
    
    // Remove item no array de itens
    if (index !== -1) {
      this.venda.itens.splice(index, 1);
    }    
    //console.log(index);

    // Recalcula o valor total dos itens
    this.calcularTotal();

    // Recalcula o valor sub-total dos itens
    this.calcularSubTotal();
  }

  calcularTotal() {
    // map = tranformando array de itens em array de numeros
    const totalItens = this.venda.itens
      .map(i => (i.produto.valor * i.quantidade))
      .reduce((total, valorCorrente) => total + valorCorrente, 0);

    this.venda.total = totalItens + this.venda.frete;
  }

  calcularSubTotal() {
    // map = tranformando array de itens em array de numeros
    const subTotalItens = this.venda.itens
      .map(i => (i.produto.valor * i.quantidade))
      .reduce((total, valorCorrente) => total + valorCorrente, 0);

    this.venda.subtotal = subTotalItens;
  }

  adicionar(frm: FormGroup) {
    this.vendasService.adicionar(this.venda)
      .subscribe(response => {
        // Reseta o formulário
        frm.reset();

        // Prepara nova venda
        this.novaVenda();

        // Menssagem
        this.messageService.add({
          severity: 'success',
          summary:'Pedido Salvo',
          detail: 'Venda adicionada com sucesso'
        });

        // Atualiza o componente de lista de venda
        this.vendaSalva.emit(response);
      });
  }

}
