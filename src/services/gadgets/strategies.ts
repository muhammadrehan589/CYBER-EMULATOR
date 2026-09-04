import { IGadgetStrategy, GadgetContext } from './types';

export class HintGadget implements IGadgetStrategy {
  execute({ currentQ, setEliminatedOptions, consumeItem }: GadgetContext): void {
    if (currentQ && currentQ.options) {
      const ans = currentQ.correctAnswer || '';
      const wrongOptions = currentQ.options.filter(
        (opt: any) => !(opt === ans || opt.startsWith(ans + '.') || opt.startsWith(ans + ')'))
      );
      const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
      setEliminatedOptions(shuffledWrong.slice(0, 2));
      consumeItem('hints');
    } else {
      alert('Hints cannot be used on this question type.');
    }
  }
}

export class TimeFreezeGadget implements IGadgetStrategy {
  execute({ setTimer, consumeItem }: GadgetContext): void {
    setTimer(prev => prev + 10);
    consumeItem('timeFreezes');
  }
}

export class ScreenFreezeGadget implements IGadgetStrategy {
  execute({ socket, opponent, consumeItem }: GadgetContext): void {
    socket?.emit('player_screen_freeze', { targetId: opponent?.empId });
    consumeItem('screenFreezes');
  }
}

export class SabotagerGadget implements IGadgetStrategy {
  execute({ socket, opponent, consumeItem }: GadgetContext): void {
    socket?.emit('player_sabotage', { targetId: opponent?.empId, penaltyXp: 50 });
    consumeItem('sabotagers');
  }
}

export class OverclockGadget implements IGadgetStrategy {
  execute({ localUser, consumeItem }: GadgetContext): void {
    fetch('/api/users', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ empId: localUser?.empId, inc: { xp: 250 } }) 
    }).catch(console.error);
    consumeItem('overclocks');
  }
}

export class DdosEmpGadget implements IGadgetStrategy {
  execute({ socket, opponent, consumeItem }: GadgetContext): void {
    socket?.emit('player_ddos', { targetId: opponent?.empId });
    consumeItem('ddosEmps');
  }
}

export class DecoyGadget implements IGadgetStrategy {
  execute(): void {
    alert('Decoys are automatically triggered when sabotaged!');
  }
}

export class SoloMatrixGadget implements IGadgetStrategy {
  execute(): void {
    alert('This tactical asset is reserved for Solo Matrix engagements.');
  }
}
