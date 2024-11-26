import {
  calculateTotals,
  ProductGroup,
  type Totals,
} from 'components/calculations/calculate-totals'
import {calculateSplits} from 'components/calculations/calculate-splits'
import type {CombinedBalanceTransaction} from 'lib/transactions'

describe('Financial Calculations', () => {
  describe('calculateTotals', () => {
    test('calculates totals for multiple transactions correctly', () => {
      const transactions: CombinedBalanceTransaction[] = [
        {
          id: 'txn_3QPBZDIugVgg5liQ1lloggbb',
          amount: 34750,
          net: 33712,
          fee: 1038,
          currency: 'usd',
          type: 'charge',
          created: 1732576799,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QPBZDIugVgg5liQ16nPgrvW',
          productId: 'kcd_product-clzlrf0g5000008jm0czdanmz',
          product: 'Epic React Pro',
          siteName: 'epic-react',
          chargeId: 'ch_3QPBZDIugVgg5liQ16nPgrvW',
          amountRefunded: null,
        },
        {
          id: 'txn_3QPBI5IugVgg5liQ2XESWSEM',
          amount: 31275,
          net: 29869,
          fee: 1406,
          currency: 'usd',
          type: 'charge',
          created: 1732575818,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QPBI5IugVgg5liQ2gqDEHKB',
          productId: 'kcd_product-clzlrf0g5000008jm0czdanmz',
          product: 'Epic React Pro',
          siteName: 'epic-react',
          chargeId: 'ch_3QPBI5IugVgg5liQ2gqDEHKB',
          amountRefunded: null,
        },
        {
          id: 'txn_3QPBI5IugVgg5liQ2XESWSEC',
          amount: 125000,
          net: 119100,
          fee: 5900,
          currency: 'usd',
          type: 'charge',
          created: 1732575818,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QPBI5IugVgg5liQ2gqDEHKC',
          productId: '5809fd2e-8072-42eb-afa2-aff7c9999d0c',
          product: 'Mocking Techniques in Vitest Bundle',
          siteName: 'epic-web',
          chargeId: 'ch_3QPBI5IugVgg5liQ2gqDEHKC',
          amountRefunded: null,
        },
        {
          id: 'txn_3QPBI5IugVgg5liQ2XESWSED',
          amount: 40000,
          net: 30502,
          fee: 9498,
          currency: 'usd',
          type: 'charge',
          created: 1732575818,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QPBI5IugVgg5liQ2gqDEHKD',
          productId: '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8',
          product: 'Pixel Perfect Figma to Tailwind',
          siteName: 'epic-web',
          chargeId: 'ch_3QPBI5IugVgg5liQ2gqDEHKD',
          amountRefunded: null,
        },
      ]

      const {totals, refundTotals} = calculateTotals(transactions)

      expect(totals.totalGross).toBe(231025) // 34750 + 31275 + 125000 + 40000
      expect(totals.totalNet).toBe(213183) // 33712 + 29869 + 119100 + 30502
      expect(totals.totalFee).toBe(17842) // 1038 + 1406 + 5900 + 9498
      expect(totals.totalCount).toBe(4)
      expect(totals.totalRefunded).toBe(0)

      // Test Epic React Pro group
      expect(totals.productGroups['Epic React Pro']).toEqual({
        productName: 'Epic React Pro',
        productId: 'kcd_product-clzlrf0g5000008jm0czdanmz',
        count: 2,
        amount: 66025,
        gross: 66025,
        net: 63581,
        fee: 2444,
        refunded: 0,
        refundCount: 0,
      })

      // Test Mocking Techniques group
      expect(
        totals.productGroups['Mocking Techniques in Vitest Bundle'],
      ).toEqual({
        productName: 'Mocking Techniques in Vitest Bundle',
        productId: '5809fd2e-8072-42eb-afa2-aff7c9999d0c',
        count: 1,
        amount: 125000,
        gross: 125000,
        net: 119100,
        fee: 5900,
        refunded: 0,
        refundCount: 0,
      })

      // Test Pixel Perfect group
      expect(totals.productGroups['Pixel Perfect Figma to Tailwind']).toEqual({
        productName: 'Pixel Perfect Figma to Tailwind',
        productId: '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8',
        count: 1,
        amount: 40000,
        gross: 40000,
        net: 30502,
        fee: 9498,
        refunded: 0,
        refundCount: 0,
      })
    })

    test('handles refunds correctly', () => {
      const transactions: CombinedBalanceTransaction[] = [
        {
          id: 'txn_3QP64IIugVgg5liQ1m2gROLS',
          amount: 30000,
          net: 28650,
          fee: 1350,
          currency: 'usd',
          type: 'charge',
          created: 1732576799,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QP64IIugVgg5liQ1qgC2nTc',
          productId: 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
          product: 'Full Stack Vol 1',
          siteName: 'epic-web',
          chargeId: 'ch_3QP64IIugVgg5liQ1qgC2nTc',
          amountRefunded: 30000,
        },
        {
          id: 'txn_3QP64IIugVgg5liQ1xGyFkor',
          amount: -30000,
          net: -30000,
          fee: 0,
          currency: 'usd',
          type: 'refund',
          created: 1732576799,
          available_on: 1732665600,
          status: 'pending',
          description: null,
          source: 'ch_3QP64IIugVgg5liQ1qgC2nTc',
          productId: 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
          product: 'Full Stack Vol 1',
          siteName: null,
          chargeId: 'ch_3QP64IIugVgg5liQ1qgC2nTc',
          amountRefunded: 30000,
        },
      ]

      const {totals, refundTotals} = calculateTotals(transactions)

      expect(totals.totalRefunded).toBe(30000)
      expect(totals.totalGross).toBe(0)
      expect(totals.totalNet).toBe(-1350)
      expect(totals.totalFee).toBe(1350)
      expect(totals.totalCount).toBe(0)

      expect(refundTotals.refundsByProduct['Full Stack Vol 1']).toEqual({
        count: 1,
        amount: 30000,
      })
    })
  })

  describe('calculateSplits', () => {
    test('handles standard 60/40 split correctly', () => {
      const totals: Totals = {
        totalGross: 100000,
        totalRefunded: 0,
        totalNet: 97000,
        totalFee: 3000,
        totalCount: 1,
        productGroups: {
          'Epic React Pro': {
            productName: 'Epic React Pro',
            productId: 'kcd_product-clzlrf0g5000008jm0czdanmz',
            count: 1,
            amount: 100000,
            gross: 100000,
            net: 97000,
            fee: 3000,
            refunded: 0,
            refundCount: 0,
          },
        },
      }

      const splits = {
        'kcd_product-clzlrf0g5000008jm0czdanmz': {
          split1: {
            percent: 0.6,
            userId: '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b',
            type: 'owner',
          },
          split2: {
            percent: 0.4,
            userId: null,
            type: 'skill',
          },
        },
      }

      const users = {
        '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b': 'Kent C. Dodds',
      }

      const result = calculateSplits(totals, splits, users)

      expect(result.totalSplits['Skill Fee']).toBe(40000)
      expect(result.totalSplits['Kent C. Dodds']).toBe(57000)
      expect(result.groupSplits['Epic React'].skillFee).toBe(40000)
      expect(result.groupSplits['Epic React'].subtotal).toBe(57000)
    })

    test('handles multi-contributor split correctly', () => {
      const totals: Totals = {
        totalGross: 125000,
        totalRefunded: 0,
        totalNet: 119100,
        totalFee: 5900,
        totalCount: 1,
        productGroups: {
          'Mocking Techniques in Vitest Bundle': {
            productName: 'Mocking Techniques in Vitest Bundle',
            productId: '5809fd2e-8072-42eb-afa2-aff7c9999d0c',
            count: 1,
            amount: 125000,
            gross: 125000,
            net: 119100,
            fee: 5900,
            refunded: 0,
            refundCount: 0,
          },
        },
      }

      const splits = {
        '5809fd2e-8072-42eb-afa2-aff7c9999d0c': {
          split1: {
            percent: 0.2,
            userId: '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b',
            type: 'owner',
          },
          split2: {
            percent: 0.5,
            userId: null,
            type: 'skill',
          },
          split3: {
            percent: 0.3,
            userId: '34dadeab-fb58-4310-8375-cfa4fb0a5015',
            type: 'contributor',
          },
        },
      }

      const users = {
        '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b': 'Kent C. Dodds',
        '34dadeab-fb58-4310-8375-cfa4fb0a5015': 'Simon Vacherolie',
      }

      const result = calculateSplits(totals, splits, users)

      expect(result.totalSplits['Skill Fee']).toBe(62500)
      expect(result.totalSplits['Kent C. Dodds']).toBe(22640)
      expect(result.totalSplits['Simon Vacherolie']).toBe(33960)
    })

    test('handles refunded transactions in splits', () => {
      const totals: Totals = {
        totalGross: 0,
        totalRefunded: 30000,
        totalNet: -1350,
        totalFee: 1350,
        totalCount: 0,
        productGroups: {
          'Full Stack Vol 1': {
            productName: 'Full Stack Vol 1',
            productId: 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
            count: 1,
            amount: 0,
            gross: 0,
            net: -1350,
            fee: 1350,
            refunded: 30000,
            refundCount: 1,
          },
        },
      }

      const splits = {
        'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002': {
          split1: {
            percent: 0.6,
            userId: '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b',
            type: 'owner',
          },
          split2: {
            percent: 0.4,
            userId: null,
            type: 'skill',
          },
        },
      }

      const users = {
        '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b': 'Kent C. Dodds',
      }

      const result = calculateSplits(totals, splits, users)

      expect(
        result.groupSplits['Epic Web'].products['Full Stack Vol 1'].skillFee,
      ).toBe(0)
      expect(
        result.groupSplits['Epic Web'].products['Full Stack Vol 1'].subtotal,
      ).toBe(-1350)
      expect(
        result.groupSplits['Epic Web'].products['Full Stack Vol 1']
          .creatorSplits['Kent C. Dodds'],
      ).toBe(-1350)
    })

    test('correctly groups products by website', () => {
      const totals: Totals = {
        totalGross: 150000,
        totalRefunded: 0,
        totalNet: 145500,
        totalFee: 4500,
        totalCount: 2,
        productGroups: {
          'Epic React Pro': {
            productName: 'Epic React Pro',
            productId: 'kcd_product-clzlrf0g5000008jm0czdanmz',
            count: 1,
            amount: 100000,
            gross: 100000,
            net: 97000,
            fee: 3000,
            refunded: 0,
            refundCount: 0,
          },
          'Full Stack Vol 1': {
            productName: 'Full Stack Vol 1',
            productId: 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
            count: 1,
            amount: 50000,
            gross: 50000,
            net: 48500,
            fee: 1500,
            refunded: 0,
            refundCount: 0,
          },
        },
      }

      const splits = {
        'kcd_product-clzlrf0g5000008jm0czdanmz': {
          split1: {
            percent: 0.6,
            userId: '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b',
            type: 'owner',
          },
          split2: {
            percent: 0.4,
            userId: null,
            type: 'skill',
          },
        },
        'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002': {
          split1: {
            percent: 0.6,
            userId: '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b',
            type: 'owner',
          },
          split2: {
            percent: 0.4,
            userId: null,
            type: 'skill',
          },
        },
      }

      const users = {
        '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b': 'Kent C. Dodds',
      }

      const result = calculateSplits(totals, splits, users)

      expect(result.groupSplits['Epic React']).toBeDefined()
      expect(result.groupSplits['Epic Web']).toBeDefined()
      expect(result.groupSplits['Epic React'].skillFee).toBe(40000)
      expect(result.groupSplits['Epic React'].subtotal).toBe(57000)
      expect(result.groupSplits['Epic Web'].skillFee).toBe(20000)
      expect(result.groupSplits['Epic Web'].subtotal).toBe(28500)
    })
  })
})
