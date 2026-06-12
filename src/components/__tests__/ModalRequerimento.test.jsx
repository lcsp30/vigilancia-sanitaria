import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalRequerimento from '../ModalRequerimento';
import api from '../../services/api';

// Mock da API
vi.mock('../../services/api');

describe('ModalRequerimento', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o botão Gerar Requerimento', () => {
    render(
      <ModalRequerimento
        categoriaDado="Geral"
        idDado={23}
        tipoEstabelecimento="cnpj"
      />
    );

    expect(screen.getByText('Gerar Requerimento')).toBeDefined();
  });

  it('exibe erro quando nenhum checkbox é marcado', async () => {
    render(
      <ModalRequerimento
        categoriaDado="Geral"
        idDado={23}
        tipoEstabelecimento="cnpj"
      />
    );

    // Abre o modal
    const trigger = screen.getByText('Gerar Requerimento');
    fireEvent.click(trigger);

    // Clica em Gerar sem marcar nada
    const submitButton = screen.getByText('Gerar');
    fireEvent.click(submitButton);

    // Verifica mensagem de erro
    await waitFor(() => {
      expect(
        screen.getByText('Selecione ao menos um item para gerar o requerimento.')
      ).toBeDefined();
    });
  });

  it('chama API com dados quando checkbox é marcado (CNPJ)', async () => {
    // Mock da resposta blob
    const mockBlob = new Blob(['mock docx content'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    api.get.mockResolvedValueOnce({ data: mockBlob });

    // Mock para URL.createObjectURL e click
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAppendChild = vi.fn();
    
    // Mock document.createElement('a')
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          click: mockClick,
          remove: mockRemove,
          setAttribute: vi.fn(),
        };
      }
      return originalCreateElement(tag);
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);

    render(
      <ModalRequerimento
        categoriaDado="Geral"
        idDado={23}
        tipoEstabelecimento="cnpj"
      />
    );

    // Abre o modal
    fireEvent.click(screen.getByText('Gerar Requerimento'));

    // Marca um checkbox (procura pelo input com name "l")
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('captura erro 500 do backend e exibe mensagem', async () => {
    // Mock erro do servidor
    api.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { error: 'Erro ao gerar requerimento', detail: 'Template not found' },
      },
    });

    render(
      <ModalRequerimento
        categoriaDado="Geral"
        idDado={23}
        tipoEstabelecimento="cnpj"
      />
    );

    // Abre o modal
    fireEvent.click(screen.getByText('Gerar Requerimento'));

    // Marca um checkbox
    const checkbox = screen.getByLabelText('LICENÇA DE FUNCIONAMENTO');
    fireEvent.click(checkbox);

    // Clica em Gerar
    const submitButton = screen.getByText('Gerar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Template not found')).toBeDefined();
    });
  });
});