import { IGadgetStrategy, GadgetContext } from './types';
import { 
  HintGadget, TimeFreezeGadget, ScreenFreezeGadget, 
  SabotagerGadget, OverclockGadget, DdosEmpGadget, 
  DecoyGadget, SoloMatrixGadget 
} from './strategies';

class GadgetRegistry {
  private strategies: Map<string, IGadgetStrategy> = new Map();

  constructor() {
    this.strategies.set('hints', new HintGadget());
    this.strategies.set('timeFreezes', new TimeFreezeGadget());
    this.strategies.set('screenFreezes', new ScreenFreezeGadget());
    this.strategies.set('sabotagers', new SabotagerGadget());
    this.strategies.set('overclocks', new OverclockGadget());
    this.strategies.set('ddosEmps', new DdosEmpGadget());
    this.strategies.set('decoys', new DecoyGadget());
    this.strategies.set('shields', new SoloMatrixGadget());
    this.strategies.set('autoSorters', new SoloMatrixGadget());
  }

  register(key: string, strategy: IGadgetStrategy) {
    this.strategies.set(key, strategy);
  }

  execute(key: string, context: GadgetContext) {
    const strategy = this.strategies.get(key);
    if (strategy) {
      strategy.execute(context);
    } else {
      console.warn(`No strategy registered for gadget: ${key}`);
    }
  }
}

export const gadgetRegistry = new GadgetRegistry();
