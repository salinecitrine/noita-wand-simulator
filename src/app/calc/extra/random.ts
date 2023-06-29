// adapted from https://github.com/kaliuresis/noa/blob/0d532bf4c3d58b708fbd390f1279948088217697/orbs.js#L66

export let random_seed = 0;

export function Random(a: number, b: number) {
  let iVar1;

  iVar1 =
    BigInt(Math.floor(random_seed).toFixed(0)) * BigInt(0x41a7) +
    (BigInt(Math.floor(random_seed).toFixed(0)) / BigInt(0x1f31d)) *
      BigInt(-0x7fffffff);
  iVar1 = BigInt.asIntN(32, iVar1);
  if (iVar1 < BigInt(1)) {
    iVar1 = iVar1 + BigInt(0x7fffffff);
  }
  iVar1 = BigInt.asIntN(32, iVar1);
  random_seed = Number(iVar1);
  return ~~(a + ~~-((b - a + 1) * (random_seed * -4.656612875e-10)));
}

function SetRandomSeedHelper(r: number) {
  let r_ = new Float64Array(1);
  r_[0] = r;
  let e_ = new BigUint64Array(r_.buffer);
  let e = e_[0];

  if (
    ((e >> BigInt(0x20)) & BigInt(0x7fffffff)) < BigInt(0x7ff00000) &&
    -9.223372036854776e18 <= r &&
    r < 9.223372036854776e18
  ) {
    let s = Math.abs(r);
    let i = BigInt(0);
    if (s !== 0.0) {
      let f = (e & BigInt(0xfffffffffffff)) | BigInt(0x0010000000000000);
      let g = BigInt(0x433) - (e >> BigInt(0x34));
      let h = f >> g;

      let j = BigInt(
        -(
          BigInt(0x433) <
          ((e >> BigInt(0x20)) & BigInt(0xffffffff)) >> BigInt(0x14)
        ),
      );
      i = (j << BigInt(0x20)) | j;
      i =
        (~i & h) |
        ((f << ((BigInt(Math.floor(s)) >> BigInt(0x34)) - BigInt(0x433))) & i);
      i = (~-BigInt(r === s) & -i) | (i & -BigInt(r === s));
      //there's some error handling here in the real code that I'm ignoring
    }
    return i & BigInt(0xffffffff);
  }

  //error!
  const error_ret_val = -0.0;
  return error_ret_val;
}

function SetRandomSeedHelper2(
  param_1: number,
  param_2: number,
  param_3: number,
) {
  let uVar1;
  let uVar2;
  let uVar3;
  let param_1_big = BigInt.asIntN(32, BigInt(param_1));
  let param_2_big = BigInt.asIntN(32, BigInt(param_2));
  let param_3_big = BigInt.asUintN(32, BigInt(param_3));

  uVar2 =
    (param_1_big - param_2_big - param_3_big) ^ (param_3_big >> BigInt(0xd));
  uVar2 = BigInt.asUintN(32, uVar2);
  uVar1 = (param_2_big - uVar2 - param_3_big) ^ (uVar2 << BigInt(8));
  uVar1 = BigInt.asUintN(32, uVar1);
  uVar3 = (param_3_big - uVar2 - uVar1) ^ (uVar1 >> BigInt(0xd));
  uVar3 = BigInt.asUintN(32, uVar3);
  uVar2 = (uVar2 - uVar1 - uVar3) ^ (uVar3 >> BigInt(0xc));
  uVar2 = BigInt.asUintN(32, uVar2);
  uVar1 = (uVar1 - uVar2 - uVar3) ^ (uVar2 << BigInt(0x10));
  uVar1 = BigInt.asUintN(32, uVar1);
  uVar3 = (uVar3 - uVar2 - uVar1) ^ (uVar1 >> BigInt(5));
  uVar3 = BigInt.asUintN(32, uVar3);
  uVar2 = (uVar2 - uVar1 - uVar3) ^ (uVar3 >> BigInt(3));
  uVar2 = BigInt.asUintN(32, uVar2);
  uVar1 = (uVar1 - uVar2 - uVar3) ^ (uVar2 << BigInt(10));
  uVar1 = BigInt.asUintN(32, uVar1);
  return BigInt.asUintN(32, (uVar3 - uVar2 - uVar1) ^ (uVar1 >> BigInt(0xf)));
}

export function SetRandomSeed(world_seed: number, x: number, y: number) {
  let a = world_seed ^ 0x93262e6f;
  let b = a & 0xfff;
  let c = (a >> 0xc) & 0xfff;

  let x_ = x + b;
  let y_ = y + c;

  let r = x_ * 134217727.0;
  let e = SetRandomSeedHelper(r);

  if (102400.0 <= Math.abs(y_) || Math.abs(x_) <= 1.0) {
    r = y_ * 134217727.0;
  } else {
    let y__ = y_ * 3483.328;
    let t = Number(e);
    y__ += t;
    y_ *= y__;
    r = y_;
  }

  let f = SetRandomSeedHelper(r);

  let g = SetRandomSeedHelper2(Number(e), Number(f), world_seed);
  let s = Number(g);
  s /= 4294967295.0;
  s *= 2147483639.0;
  s += 1.0;

  if (2147483647.0 <= s) {
    s = s * 0.5;
  }
  random_seed = s;

  Random(0, 0);

  let h = world_seed & 3;
  while (h) {
    Random(0, 0);
    h--;
  }
}
