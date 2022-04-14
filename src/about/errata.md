## SIV Research Errata

### Neff 2001:
- pg 4, eq 14: Product of y_i's should say from `i = 1`, not `i - 1`.

### Neff 2004:
- pg 17, eq 49: `b_j` and `c_i` positions appear accidentally swapped, if we want those equations to match definition of `r_i` and `s_i`.
  - Simple typographical error. Algebra breaks if not corrected, which is easy.

- pg 18, eq 50, and 51: Missing `\gamma` factor on right side of both equations to match eq 48.

- pg 5 / pg 19: Lemma 4 restricts its `r vector` to unique non-zero random values in `Z_q`, but eq 64's `b_i`'s, which are supposed to be analogous to lemma 4's `r vector`, are simply random in `Z_q`, but do not share the same restrictions to be non-zero nor unique.
  - This does not weaken Soundness.

- pg 5, Lemma 4: Unproven. He gives a probability of `< 2/q`, this appears to depend upon the uniqueness restriction on the `r_vector`, which as described in previous errata is not applicable when used in the full proof.
    - Here is a proof for why the probability becomes `1/q`, by dropping the uniqueness and non-zero restrictions on the `r_vector`.
      1. Sort `v vector` such that the last item is non-zero.
      2. Define `v_bar` as the sorted `v vector` up to `k-1`, without the last item, and define `r_bar` as the matching re-sorted `r_vector` up to `k-1`, without the last item.
      3. Take the dot-product of `v_bar` and `r_bar`, and subtract from constant `a`, to result in a new constant `a_bar`.
      4. We're left with `v_k` * `r_k` = `a_bar`.
      5. We multiply both sides by the inverse of `v_k` (which must be non-zero by step 1), leaving:
         `r_k` = `c`, where c is some number in `Z_q`.
      6. This holds with a `1 / q` chance.
